// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

/**
 * @title X402StreamingPayments
 * @notice Implements x402 payment protocol with EIP-8004 multiagent streaming support
 * @dev Enables per-second streaming payments to AI agents using USDC on IOTA EVM
 */
contract X402StreamingPayments is Ownable, ReentrancyGuard, EIP712 {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    // ============ Constants ============
    
    bytes32 public constant STREAM_TYPEHASH = keccak256(
        "StreamPayment(address payer,uint256 agentId,uint256 amountPerSecond,uint256 maxDuration,uint256 nonce,uint256 deadline)"
    );
    
    bytes32 public constant EXACT_PAYMENT_TYPEHASH = keccak256(
        "ExactPayment(address from,address to,uint256 value,uint256 validAfter,uint256 validBefore,bytes32 nonce)"
    );

    // ============ State Variables ============
    
    /// @notice USDC token contract
    IERC20 public immutable usdc;
    
    /// @notice EIP-8004 Agent Identity Registry
    address public agentRegistry;
    
    /// @notice Platform fee percentage (in basis points, 100 = 1%)
    uint256 public platformFeeBps = 100; // 1% default
    
    /// @notice Platform fee recipient
    address public feeRecipient;
    
    /// @notice Minimum payment amount (in USDC wei, 6 decimals)
    uint256 public minPaymentAmount = 1000; // 0.001 USDC
    
    /// @notice Maximum stream duration (in seconds)
    uint256 public maxStreamDuration = 86400; // 24 hours
    
    // ============ Structs ============
    
    struct Stream {
        address payer;
        uint256 agentId;
        address agentWallet;
        uint256 amountPerSecond;
        uint256 startTime;
        uint256 endTime;
        uint256 totalPaid;
        uint256 lastClaimTime;
        bool active;
    }
    
    struct AgentConfig {
        address wallet;
        uint256 pricePerSecond;
        bool isActive;
        uint256 totalEarned;
        uint256 totalStreams;
    }
    
    struct PaymentRequirements {
        string scheme;
        string network;
        uint256 maxAmountRequired;
        string resource;
        string description;
        string mimeType;
        address payTo;
        uint256 maxTimeoutSeconds;
        address asset;
    }
    
    // ============ Storage Mappings ============
    
    /// @notice Stream ID => Stream details
    mapping(uint256 => Stream) public streams;
    
    /// @notice Agent ID => Agent configuration
    mapping(uint256 => AgentConfig) public agents;
    
    /// @notice Payer => Agent ID => Active stream ID
    mapping(address => mapping(uint256 => uint256)) public activeStreams;
    
    /// @notice Nonce tracking for signature replay protection
    mapping(address => uint256) public nonces;
    
    /// @notice Track used nonces for EIP-3009 style payments
    mapping(address => mapping(bytes32 => bool)) public authorizationStates;
    
    /// @notice Total streams created
    uint256 public totalStreamsCreated;
    
    /// @notice Total volume processed
    uint256 public totalVolumeProcessed;
    
    // ============ Events ============
    
    event StreamCreated(
        uint256 indexed streamId,
        address indexed payer,
        uint256 indexed agentId,
        uint256 amountPerSecond,
        uint256 duration
    );
    
    event StreamPaused(
        uint256 indexed streamId,
        uint256 amountPaid,
        uint256 duration
    );
    
    event StreamResumed(
        uint256 indexed streamId
    );
    
    event StreamClaimed(
        uint256 indexed streamId,
        uint256 amount,
        uint256 platformFee
    );
    
    event StreamCancelled(
        uint256 indexed streamId,
        uint256 refundAmount
    );
    
    event AgentRegistered(
        uint256 indexed agentId,
        address indexed wallet,
        uint256 pricePerSecond
    );
    
    event AgentUpdated(
        uint256 indexed agentId,
        address indexed wallet,
        uint256 pricePerSecond
    );
    
    event ExactPaymentExecuted(
        address indexed from,
        address indexed to,
        uint256 amount,
        bytes32 nonce
    );
    
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeRecipientUpdated(address oldRecipient, address newRecipient);
    
    // ============ Constructor ============
    
    constructor(
        address _usdc,
        address _agentRegistry,
        address _feeRecipient
    ) Ownable(msg.sender) EIP712("X402StreamingPayments", "1") {
        require(_usdc != address(0), "Invalid USDC address");
        require(_feeRecipient != address(0), "Invalid fee recipient");
        
        usdc = IERC20(_usdc);
        agentRegistry = _agentRegistry;
        feeRecipient = _feeRecipient;
    }
    
    // ============ Agent Management ============
    
    /**
     * @notice Register a new agent with streaming payment capability
     * @param agentId The EIP-8004 agent NFT token ID
     * @param wallet Wallet address to receive payments
     * @param pricePerSecond Price in USDC wei per second (6 decimals)
     */
    function registerAgent(
        uint256 agentId,
        address wallet,
        uint256 pricePerSecond
    ) external {
        require(wallet != address(0), "Invalid wallet");
        require(pricePerSecond >= minPaymentAmount, "Price too low");
        require(!agents[agentId].isActive, "Agent already registered");
        
        // In production, verify ownership via agentRegistry NFT
        // IERC721(agentRegistry).ownerOf(agentId) == msg.sender
        
        agents[agentId] = AgentConfig({
            wallet: wallet,
            pricePerSecond: pricePerSecond,
            isActive: true,
            totalEarned: 0,
            totalStreams: 0
        });
        
        emit AgentRegistered(agentId, wallet, pricePerSecond);
    }
    
    /**
     * @notice Update agent configuration
     */
    function updateAgent(
        uint256 agentId,
        address wallet,
        uint256 pricePerSecond
    ) external {
        require(agents[agentId].isActive, "Agent not registered");
        // In production: verify ownership
        
        agents[agentId].wallet = wallet;
        agents[agentId].pricePerSecond = pricePerSecond;
        
        emit AgentUpdated(agentId, wallet, pricePerSecond);
    }
    
    // ============ Streaming Payment Functions ============
    
    /**
     * @notice Create a new streaming payment to an agent
     * @param agentId The agent to pay
     * @param duration Duration in seconds
     */
    function createStream(
        uint256 agentId,
        uint256 duration
    ) external nonReentrant returns (uint256 streamId) {
        AgentConfig storage agent = agents[agentId];
        require(agent.isActive, "Agent not active");
        require(duration > 0 && duration <= maxStreamDuration, "Invalid duration");
        require(activeStreams[msg.sender][agentId] == 0, "Stream already active");
        
        uint256 totalAmount = agent.pricePerSecond * duration;
        require(totalAmount >= minPaymentAmount, "Amount too low");
        
        // Transfer funds to contract
        usdc.safeTransferFrom(msg.sender, address(this), totalAmount);
        
        streamId = ++totalStreamsCreated;
        
        streams[streamId] = Stream({
            payer: msg.sender,
            agentId: agentId,
            agentWallet: agent.wallet,
            amountPerSecond: agent.pricePerSecond,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            totalPaid: 0,
            lastClaimTime: block.timestamp,
            active: true
        });
        
        activeStreams[msg.sender][agentId] = streamId;
        agent.totalStreams++;
        
        emit StreamCreated(streamId, msg.sender, agentId, agent.pricePerSecond, duration);
        
        return streamId;
    }
    
    /**
     * @notice Claim accumulated payments from a stream
     * @param streamId The stream to claim from
     */
    function claimStream(uint256 streamId) external nonReentrant {
        Stream storage stream = streams[streamId];
        require(stream.active, "Stream not active");
        
        uint256 claimable = getClaimableAmount(streamId);
        require(claimable > 0, "Nothing to claim");
        
        uint256 platformFee = (claimable * platformFeeBps) / 10000;
        uint256 agentAmount = claimable - platformFee;
        
        stream.totalPaid += claimable;
        stream.lastClaimTime = block.timestamp;
        
        // Update agent stats
        agents[stream.agentId].totalEarned += agentAmount;
        totalVolumeProcessed += claimable;
        
        // Transfer payments
        if (platformFee > 0) {
            usdc.safeTransfer(feeRecipient, platformFee);
        }
        usdc.safeTransfer(stream.agentWallet, agentAmount);
        
        // Deactivate if stream ended
        if (block.timestamp >= stream.endTime) {
            stream.active = false;
            activeStreams[stream.payer][stream.agentId] = 0;
        }
        
        emit StreamClaimed(streamId, agentAmount, platformFee);
    }
    
    /**
     * @notice Pause an active stream
     */
    function pauseStream(uint256 streamId) external nonReentrant {
        Stream storage stream = streams[streamId];
        require(stream.active, "Stream not active");
        require(stream.payer == msg.sender, "Not stream owner");
        
        // Claim pending amount first
        uint256 claimable = getClaimableAmount(streamId);
        if (claimable > 0) {
            uint256 platformFee = (claimable * platformFeeBps) / 10000;
            uint256 agentAmount = claimable - platformFee;
            
            stream.totalPaid += claimable;
            
            agents[stream.agentId].totalEarned += agentAmount;
            totalVolumeProcessed += claimable;
            
            if (platformFee > 0) {
                usdc.safeTransfer(feeRecipient, platformFee);
            }
            usdc.safeTransfer(stream.agentWallet, agentAmount);
        }
        
        // Calculate and refund remaining
        uint256 timeElapsed = block.timestamp - stream.startTime;
        uint256 totalCost = stream.amountPerSecond * (stream.endTime - stream.startTime);
        uint256 remaining = totalCost - stream.totalPaid;
        
        stream.active = false;
        activeStreams[stream.payer][stream.agentId] = 0;
        
        if (remaining > 0) {
            usdc.safeTransfer(stream.payer, remaining);
        }
        
        emit StreamPaused(streamId, stream.totalPaid, timeElapsed);
    }
    
    /**
     * @notice Cancel a stream and refund remaining balance
     */
    function cancelStream(uint256 streamId) external nonReentrant {
        Stream storage stream = streams[streamId];
        require(stream.active, "Stream not active");
        require(stream.payer == msg.sender, "Not stream owner");
        
        uint256 claimable = getClaimableAmount(streamId);
        uint256 totalCost = stream.amountPerSecond * (stream.endTime - stream.startTime);
        uint256 refund = totalCost - stream.totalPaid - claimable;
        
        stream.active = false;
        activeStreams[stream.payer][stream.agentId] = 0;
        
        // Pay agent for time used
        if (claimable > 0) {
            uint256 platformFee = (claimable * platformFeeBps) / 10000;
            uint256 agentAmount = claimable - platformFee;
            
            stream.totalPaid += claimable;
            agents[stream.agentId].totalEarned += agentAmount;
            totalVolumeProcessed += claimable;
            
            if (platformFee > 0) {
                usdc.safeTransfer(feeRecipient, platformFee);
            }
            usdc.safeTransfer(stream.agentWallet, agentAmount);
        }
        
        // Refund remaining
        if (refund > 0) {
            usdc.safeTransfer(stream.payer, refund);
        }
        
        emit StreamCancelled(streamId, refund);
    }
    
    // ============ x402 Exact Payment Implementation ============
    
    /**
     * @notice Execute an exact x402 payment (EIP-3009 style)
     * @dev Implements x402 "exact" scheme for one-time payments
     */
    function executeExactPayment(
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        bytes memory signature
    ) external nonReentrant {
        require(block.timestamp > validAfter, "Payment not yet valid");
        require(block.timestamp < validBefore, "Payment expired");
        require(!authorizationStates[from][nonce], "Payment already executed");
        require(value >= minPaymentAmount, "Amount too low");
        
        // Verify EIP-712 signature
        bytes32 structHash = keccak256(
            abi.encode(
                EXACT_PAYMENT_TYPEHASH,
                from,
                to,
                value,
                validAfter,
                validBefore,
                nonce
            )
        );
        
        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = digest.recover(signature);
        require(signer == from, "Invalid signature");
        
        // Mark nonce as used
        authorizationStates[from][nonce] = true;
        
        // Calculate fees
        uint256 platformFee = (value * platformFeeBps) / 10000;
        uint256 recipientAmount = value - platformFee;
        
        totalVolumeProcessed += value;
        
        // Transfer tokens
        usdc.safeTransferFrom(from, to, recipientAmount);
        if (platformFee > 0) {
            usdc.safeTransferFrom(from, feeRecipient, platformFee);
        }
        
        emit ExactPaymentExecuted(from, to, value, nonce);
    }
    
    /**
     * @notice Verify x402 payment signature without executing
     * @dev Used by resource servers to verify payment before providing service
     */
    function verifyExactPayment(
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        bytes memory signature
    ) external view returns (bool isValid, string memory reason) {
        if (block.timestamp <= validAfter) {
            return (false, "Payment not yet valid");
        }
        if (block.timestamp >= validBefore) {
            return (false, "Payment expired");
        }
        if (authorizationStates[from][nonce]) {
            return (false, "Payment already executed");
        }
        if (value < minPaymentAmount) {
            return (false, "Amount too low");
        }
        
        bytes32 structHash = keccak256(
            abi.encode(
                EXACT_PAYMENT_TYPEHASH,
                from,
                to,
                value,
                validAfter,
                validBefore,
                nonce
            )
        );
        
        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = digest.recover(signature);
        
        if (signer != from) {
            return (false, "Invalid signature");
        }
        
        return (true, "");
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get claimable amount for a stream
     */
    function getClaimableAmount(uint256 streamId) public view returns (uint256) {
        Stream storage stream = streams[streamId];
        if (!stream.active) return 0;
        
        uint256 currentTime = block.timestamp > stream.endTime 
            ? stream.endTime 
            : block.timestamp;
        
        uint256 timeElapsed = currentTime - stream.lastClaimTime;
        return timeElapsed * stream.amountPerSecond;
    }
    
    /**
     * @notice Get x402 payment requirements for an agent
     * @dev Returns data compatible with x402 protocol spec
     */
    function getPaymentRequirements(
        uint256 agentId,
        uint256 duration
    ) external view returns (PaymentRequirements memory) {
        AgentConfig storage agent = agents[agentId];
        require(agent.isActive, "Agent not active");
        
        return PaymentRequirements({
            scheme: "exact",
            network: "1076", // IOTA EVM Testnet
            maxAmountRequired: agent.pricePerSecond * duration,
            resource: string(abi.encodePacked("agent://", _uint2str(agentId))),
            description: "AI Agent Streaming Service",
            mimeType: "application/json",
            payTo: agent.wallet,
            maxTimeoutSeconds: duration,
            asset: address(usdc)
        });
    }
    
    /**
     * @notice Get agent statistics
     */
    function getAgentStats(uint256 agentId) external view returns (
        address wallet,
        uint256 pricePerSecond,
        bool isActive,
        uint256 totalEarned,
        uint256 totalStreams
    ) {
        AgentConfig storage agent = agents[agentId];
        return (
            agent.wallet,
            agent.pricePerSecond,
            agent.isActive,
            agent.totalEarned,
            agent.totalStreams
        );
    }
    
    /**
     * @notice Get stream details
     */
    function getStreamDetails(uint256 streamId) external view returns (
        address payer,
        uint256 agentId,
        address agentWallet,
        uint256 amountPerSecond,
        uint256 startTime,
        uint256 endTime,
        uint256 totalPaid,
        uint256 claimable,
        bool active
    ) {
        Stream memory stream = streams[streamId];
        claimable = getClaimableAmount(streamId);
        return (
            stream.payer,
            stream.agentId,
            stream.agentWallet,
            stream.amountPerSecond,
            stream.startTime,
            stream.endTime,
            stream.totalPaid,
            claimable,
            stream.active
        );
    }
    
    // ============ Admin Functions ============
    
    function setPlatformFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= 1000, "Fee too high"); // Max 10%
        uint256 oldFee = platformFeeBps;
        platformFeeBps = newFeeBps;
        emit PlatformFeeUpdated(oldFee, newFeeBps);
    }
    
    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid recipient");
        address oldRecipient = feeRecipient;
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(oldRecipient, newRecipient);
    }
    
    function setMinPaymentAmount(uint256 newMin) external onlyOwner {
        minPaymentAmount = newMin;
    }
    
    function setMaxStreamDuration(uint256 newMax) external onlyOwner {
        maxStreamDuration = newMax;
    }
    
    // ============ Internal Helper Functions ============
    
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
