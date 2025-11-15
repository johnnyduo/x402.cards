// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EIP8004AgentRegistry
 * @notice Implementation of EIP-8004 Identity Registry for Trustless Agents
 * @dev ERC-721 based agent registration with metadata and discovery
 */
contract EIP8004AgentRegistry is ERC721URIStorage, Ownable {
    // ============ State Variables ============
    
    uint256 private _agentIdCounter;
    
    /// @notice Agent ID => Key => Metadata value
    mapping(uint256 => mapping(string => bytes)) private _agentMetadata;
    
    /// @notice Track all metadata keys for an agent
    mapping(uint256 => string[]) private _agentMetadataKeys;
    
    // ============ Events ============
    
    event Registered(
        uint256 indexed agentId,
        string tokenURI,
        address indexed owner
    );
    
    event MetadataSet(
        uint256 indexed agentId,
        string indexed indexedKey,
        string key,
        bytes value
    );
    
    // ============ Structs ============
    
    struct MetadataEntry {
        string key;
        bytes value;
    }
    
    // ============ Constructor ============
    
    constructor() ERC721("EIP8004 Agent", "AGENT") Ownable(msg.sender) {
        // Start agent IDs at 1
        _agentIdCounter = 1;
    }
    
    // ============ Registration Functions ============
    
    /**
     * @notice Register a new agent with URI and metadata
     * @param tokenURI URI pointing to agent registration file
     * @param metadata Array of key-value metadata pairs
     * @return agentId The newly minted agent token ID
     */
    function register(
        string memory tokenURI,
        MetadataEntry[] calldata metadata
    ) external returns (uint256 agentId) {
        agentId = _agentIdCounter;
        unchecked {
            _agentIdCounter++;
        }
        
        _safeMint(msg.sender, agentId);
        _setTokenURI(agentId, tokenURI);
        
        // Set metadata
        for (uint256 i = 0; i < metadata.length; i++) {
            _setMetadata(agentId, metadata[i].key, metadata[i].value);
        }
        
        emit Registered(agentId, tokenURI, msg.sender);
        return agentId;
    }
    
    /**
     * @notice Register a new agent with only URI
     */
    function register(string memory tokenURI) external returns (uint256 agentId) {
        agentId = _agentIdCounter;
        unchecked {
            _agentIdCounter++;
        }
        
        _safeMint(msg.sender, agentId);
        _setTokenURI(agentId, tokenURI);
        
        emit Registered(agentId, tokenURI, msg.sender);
        return agentId;
    }
    
    /**
     * @notice Register a new agent (URI to be set later)
     */
    function register() external returns (uint256 agentId) {
        agentId = _agentIdCounter;
        unchecked {
            _agentIdCounter++;
        }
        
        _safeMint(msg.sender, agentId);
        
        emit Registered(agentId, "", msg.sender);
        return agentId;
    }
    
    // ============ Metadata Functions ============
    
    /**
     * @notice Set metadata for an agent
     * @dev Only callable by agent owner or approved operator
     */
    function setMetadata(
        uint256 agentId,
        string calldata key,
        bytes calldata value
    ) external {
        require(_isAuthorized(ownerOf(agentId), msg.sender, agentId), "Not authorized");
        _setMetadata(agentId, key, value);
    }
    
    /**
     * @notice Set multiple metadata entries at once
     */
    function setMetadataBatch(
        uint256 agentId,
        MetadataEntry[] calldata entries
    ) external {
        require(_isAuthorized(ownerOf(agentId), msg.sender, agentId), "Not authorized");
        
        for (uint256 i = 0; i < entries.length; i++) {
            _setMetadata(agentId, entries[i].key, entries[i].value);
        }
    }
    
    /**
     * @notice Get metadata value for an agent
     */
    function getMetadata(
        uint256 agentId,
        string calldata key
    ) external view returns (bytes memory) {
        require(ownerOf(agentId) != address(0), "Agent does not exist");
        return _agentMetadata[agentId][key];
    }
    
    /**
     * @notice Get all metadata keys for an agent
     */
    function getMetadataKeys(uint256 agentId) external view returns (string[] memory) {
        require(ownerOf(agentId) != address(0), "Agent does not exist");
        return _agentMetadataKeys[agentId];
    }
    
    /**
     * @notice Get all metadata for an agent
     */
    function getAllMetadata(uint256 agentId) external view returns (
        string[] memory keys,
        bytes[] memory values
    ) {
        require(ownerOf(agentId) != address(0), "Agent does not exist");
        
        string[] memory storedKeys = _agentMetadataKeys[agentId];
        bytes[] memory storedValues = new bytes[](storedKeys.length);
        
        for (uint256 i = 0; i < storedKeys.length; i++) {
            storedValues[i] = _agentMetadata[agentId][storedKeys[i]];
        }
        
        return (storedKeys, storedValues);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get total number of registered agents
     */
    function totalAgents() external view returns (uint256) {
        return _agentIdCounter - 1;
    }
    
    /**
     * @notice Check if an agent exists
     */
    function agentExists(uint256 agentId) external view returns (bool) {
        return ownerOf(agentId) != address(0);
    }
    
    /**
     * @notice Get agent owner and URI
     */
    function getAgentInfo(uint256 agentId) external view returns (
        address owner,
        string memory uri
    ) {
        owner = ownerOf(agentId);
        require(owner != address(0), "Agent does not exist");
        uri = tokenURI(agentId);
        return (owner, uri);
    }
    
    // ============ Internal Functions ============
    
    function _setMetadata(
        uint256 agentId,
        string memory key,
        bytes memory value
    ) internal {
        // If this is a new key, add it to the keys array
        if (_agentMetadata[agentId][key].length == 0) {
            _agentMetadataKeys[agentId].push(key);
        }
        
        _agentMetadata[agentId][key] = value;
        emit MetadataSet(agentId, key, key, value);
    }
}
