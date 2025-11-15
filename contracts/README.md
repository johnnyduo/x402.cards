# x402 StreamFlow Smart Contracts

Complete implementation of x402 payment protocol with EIP-8004 multiagent support for streaming payments on IOTA EVM.

## Features

### ✅ x402 Payment Protocol Implementation
- **Exact Payment Scheme**: EIP-3009 style one-time payments with signatures
- **Streaming Payments**: Per-second payment streams to AI agents
- **Payment Verification**: On-chain and off-chain verification support
- **Gas-free for Users**: Facilitator model for transaction execution
- **Payment Requirements**: Full x402 spec compliance for resource servers

### ✅ EIP-8004 Trustless Agents
- **Identity Registry**: ERC-721 based agent registration with metadata
- **Agent Discovery**: On-chain agent information and endpoints
- **Portable Identity**: Cross-chain compatible agent IDs
- **Metadata Management**: Flexible key-value metadata storage

### ✅ Streaming Features
- **Real-time Payments**: Per-second payment calculation and claiming
- **Stream Management**: Create, pause, resume, and cancel streams
- **Multi-agent Support**: Simultaneous streams to multiple agents
- **Fee Management**: Platform fees with configurable rates

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                      │
│  (React + Wagmi + Viem + Reown AppKit)                      │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│               Smart Contract Layer                           │
│  ┌──────────────────────┐    ┌─────────────────────────┐   │
│  │ EIP8004AgentRegistry │◄───┤ X402StreamingPayments   │   │
│  │  (ERC-721)           │    │  (x402 Protocol)        │   │
│  │                      │    │                         │   │
│  │ • Agent Registration │    │ • Streaming Payments    │   │
│  │ • Metadata Storage   │    │ • Exact Payments        │   │
│  │ • Discovery          │    │ • Fee Management        │   │
│  └──────────────────────┘    └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                  IOTA EVM Testnet                            │
│  Chain ID: 1076                                              │
│  USDC: 0x1ce14fD9dd6678fC3d192f02207d6ff999B04037          │
└─────────────────────────────────────────────────────────────┘
```

## Contracts

### X402StreamingPayments.sol
Main payment contract implementing:
- x402 "exact" payment scheme with EIP-712 signatures
- Streaming payment management (create, claim, pause, cancel)
- Agent registration and configuration
- Platform fee collection
- Payment verification for resource servers

**Key Functions:**
- `createStream(agentId, duration)` - Start paying an agent per second
- `claimStream(streamId)` - Claim accumulated payments
- `executeExactPayment(...)` - Execute one-time x402 payment
- `verifyExactPayment(...)` - Verify payment before execution
- `getPaymentRequirements(agentId)` - Get x402 payment details

### EIP8004AgentRegistry.sol
EIP-8004 compliant agent identity registry:
- ERC-721 token for each agent
- URI storage for agent registration files
- Flexible metadata system
- Agent discovery and browsing

**Key Functions:**
- `register(tokenURI, metadata)` - Register new agent
- `setMetadata(agentId, key, value)` - Update agent info
- `getAgentInfo(agentId)` - Get agent details
- `getAllMetadata(agentId)` - Get all agent metadata

## Deployment

### Prerequisites
```bash
cd contracts
npm install
```

### Environment Setup
Create `.env` file:
```env
PRIVATE_KEY=your_private_key_here
```

### Deploy to IOTA EVM Testnet
```bash
npx hardhat compile
npx hardhat run scripts/deploy.ts --network iotaTestnet
```

### Verify Contracts
```bash
npx hardhat verify --network iotaTestnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Configuration

### Network Details
- **Network**: IOTA EVM Testnet
- **Chain ID**: 1076
- **RPC**: https://json-rpc.evm.testnet.iota.cafe
- **Explorer**: https://explorer.evm.testnet.iota.cafe
- **USDC Contract**: 0x1ce14fD9dd6678fC3d192f02207d6ff999B04037

### Default Settings
- **Platform Fee**: 1% (100 basis points)
- **Min Payment**: 0.001 USDC
- **Max Stream Duration**: 24 hours (86400 seconds)

## Usage Examples

### Creating a Stream
```typescript
import { ethers } from 'ethers';

// Connect to contract
const streamingPayments = new ethers.Contract(
  CONTRACT_ADDRESS,
  ABI,
  signer
);

// Approve USDC
const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
const amount = ethers.parseUnits("0.36", 6); // 0.0001 USDC/sec * 3600 sec
await usdc.approve(CONTRACT_ADDRESS, amount);

// Create 1 hour stream to agent #1
const tx = await streamingPayments.createStream(1, 3600);
await tx.wait();
```

### Claiming from Stream
```typescript
// Agent claims accumulated payments
const tx = await streamingPayments.claimStream(streamId);
await tx.wait();
```

### x402 Exact Payment
```typescript
// Generate EIP-712 signature
const domain = {
  name: 'X402StreamingPayments',
  version: '1',
  chainId: 1076,
  verifyingContract: CONTRACT_ADDRESS
};

const types = {
  ExactPayment: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'validAfter', type: 'uint256' },
    { name: 'validBefore', type: 'uint256' },
    { name: 'nonce', type: 'bytes32' }
  ]
};

const message = {
  from: payerAddress,
  to: recipientAddress,
  value: ethers.parseUnits("1", 6),
  validAfter: Math.floor(Date.now() / 1000),
  validBefore: Math.floor(Date.now() / 1000) + 3600,
  nonce: ethers.randomBytes(32)
};

const signature = await signer.signTypedData(domain, types, message);

// Execute payment
await streamingPayments.executeExactPayment(
  message.from,
  message.to,
  message.value,
  message.validAfter,
  message.validBefore,
  message.nonce,
  signature
);
```

## Security Features

- ✅ **ReentrancyGuard**: Protection against reentrancy attacks
- ✅ **EIP-712 Signatures**: Typed structured data signing
- ✅ **Nonce Tracking**: Replay attack prevention
- ✅ **Access Control**: Owner-only admin functions
- ✅ **SafeERC20**: Safe token transfers
- ✅ **Time Validation**: Payment expiry checks
- ✅ **Amount Validation**: Minimum payment enforcement

## Testing

```bash
npx hardhat test
npx hardhat coverage
```

## Gas Optimization

- Uses `viaIR` optimizer for better gas efficiency
- Optimized storage layout
- Batch operations where possible
- View functions for off-chain queries

## Integration with Frontend

Update `src/config/contracts.ts`:
```typescript
export const STREAMING_PAYMENTS_ADDRESS = "0x..." as const;
export const AGENT_REGISTRY_ADDRESS = "0x..." as const;

export const STREAMING_PAYMENTS_ABI = [...];
export const AGENT_REGISTRY_ABI = [...];
```

## x402 Protocol Compliance

This implementation follows the x402 v1 specification:
- ✅ Payment Required Response (402 status)
- ✅ X-PAYMENT header format
- ✅ Payment Requirements schema
- ✅ Verification endpoint interface
- ✅ Settlement endpoint interface
- ✅ Exact payment scheme on EVM

## EIP-8004 Compliance

Full implementation of EIP-8004 Trustless Agents:
- ✅ Identity Registry (ERC-721 based)
- ✅ Agent registration with URI
- ✅ Metadata management
- ✅ Agent discovery
- ✅ Cross-chain compatible identifiers

## Roadmap

- [ ] Reputation Registry (EIP-8004)
- [ ] Validation Registry (EIP-8004)
- [ ] Additional payment schemes (upto, subscription)
- [ ] Multi-token support
- [ ] Mainnet deployment
- [ ] Governance system

## License

Apache-2.0

## Support

For issues and questions:
- GitHub Issues: https://github.com/johnnyduo/x402-streamflow/issues
- x402 Docs: https://x402.org
- EIP-8004: https://eips.ethereum.org/EIPS/eip-8004
