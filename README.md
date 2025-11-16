# x402.Cards - Tokenized AI Agents with Real-Time Streaming Payments

<div align="center">

[![IOTA EVM](https://img.shields.io/badge/IOTA-EVM-00E5FF?style=for-the-badge&logo=iota)](https://evm.iota.org/)
[![EIP-8004](https://img.shields.io/badge/EIP--8004-Agent_NFTs-9B59B6?style=for-the-badge)](https://github.com)
[![X402](https://img.shields.io/badge/X402-Streaming-00E5CC?style=for-the-badge)](https://x402.cards)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.28-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![ReactFlow](https://img.shields.io/badge/ReactFlow-Visualization-FF5555?style=for-the-badge)](https://reactflow.dev/)

**Autonomous tokenized AI agents with per-second streaming payments for real-time DeFi intelligence and automated web crawling**

[Live Demo](https://x402.cards) | [Documentation](#-features) | [Contracts](#-smart-contracts) | [API](#-api-endpoints)

</div>

---

## 🎯 Overview

<img width="1439" height="822" alt="Screenshot 2568-11-16 at 19 57 46" src="https://github.com/user-attachments/assets/4e85d426-3123-44e9-8df1-f6309b199ddf" />

x402.Cards is a revolutionary DeFi automation platform powered by **EIP-8004 tokenized agents** with **X402 streaming payment protocol**. Deploy autonomous AI agents as NFTs that provide real-time market intelligence, automated web crawling, and DeFi analytics—paying only per-second for active streams via smart contracts on IOTA EVM.

### Key Innovations

- **🎭 EIP-8004 Tokenized Agents**: Each AI agent is an NFT with on-chain identity, tradeable and composable
- **⚡ X402 Streaming Payments**: Real-time per-second payment streams with automatic USDC settlement
- **🤖 Autonomous DeFi Automation**: Six specialized AI agents providing continuous market intelligence
- **🕷️ AI Web Crawler**: Distributed autonomous crawler for blockchain data indexing and analysis
- **🔄 ReactFlow Visualization**: Interactive automation flow UI showing real-time payment streams
- **📊 Real-time Analytics**: Live tracking of spending, earnings, and net balance across all agents
- **🔗 IOTA EVM Native**: Gas-optimized smart contracts leveraging IOTA's micro-payment capabilities

---

## 🚀 Features

<img width="1354" height="850" alt="Screenshot 2568-11-16 at 23 32 18" src="https://github.com/user-attachments/assets/8e310fab-97b3-4151-b1c8-3854be7177e8" />

### Intelligent Agents

| Agent | Category | Cost/Sec | Description |
|-------|----------|----------|-------------|
| **Signal Forge** | Trading | 0.0010 USDC | High-frequency trade signal generator with adaptive quantitative strategies |
| **Volatility Pulse** | Analysis | 0.0010 USDC | Real-time volatility detection across majors and synthetic pairs |
| **Arb Navigator** | MEV | 0.0005 USDC | Cross-DEX arbitrage opportunity scanner with gas optimization |
| **Sentiment Radar** | Social | 0.0008 USDC | AI-powered sentiment analysis from crypto Twitter and influencers |
| **Risk Sentinel** | Risk | 0.0010 USDC | Liquidation risk scoring and collateral exposure monitoring |
| **AI Crawler Service** | Data | 0.0030 USDC | Distributed web crawler for blockchain data indexing |

<img width="1274" height="858" alt="Screenshot 2568-11-16 at 23 34 37" src="https://github.com/user-attachments/assets/bdad9a91-723d-46d7-a04f-f3ff0675a424" />

### Core Functionality

- **Stream Management**: Create, pause, resume, and cancel payment streams on-chain
- **Agent Registration**: Register agents with custom pricing and wallet addresses
- **Real-time Sync**: On-chain state automatically syncs across all UI components
- **Gas Optimization**: Batched operations and efficient contract design
- **Wallet Integration**: WalletConnect v2 support via Reown
- **Responsive Design**: Mobile-first UI with glassmorphic design system

---

<img width="1444" height="872" alt="Screenshot 2568-11-16 at 19 59 42" src="https://github.com/user-attachments/assets/a920d4c6-dc61-464b-bbe4-1a4157b87edb" />

## 🏗️ Architecture

### Tech Stack

**Frontend**
- React 18.3 + TypeScript 5.5
- Vite 5.4 (Build tool)
- TailwindCSS 3.4 (Styling)
- shadcn/ui (Component library)
- ReactFlow (Flow visualization)
- wagmi 2.x + viem (Web3 integration)
- Reown/WalletConnect (Wallet connection)

**Smart Contracts**
- Solidity 0.8.28
- Hardhat (Development framework)
- IOTA EVM Testnet
- OpenZeppelin Contracts

**API Layer**
- Node.js/Express endpoints
- Vercel Edge Functions
- Redis caching (optional)

### Contract Architecture

```
X402StreamingPayments.sol (Core payment logic)
├── Agent Registry Integration (EIP-8004)
├── Stream Management (create/pause/cancel streams)
├── Payment Calculation (per-second accrual)
├── Claim System (withdraw accumulated funds)
└── Fee System (0.5% platform fee)

EIP8004AgentRegistry.sol (Agent identity NFTs)
├── ERC721 NFT per agent
├── Agent metadata storage
├── URI & JSON metadata support
└── Ownership verification

USDC.sol (Testnet token)
├── ERC20 Standard
├── Mint Function (faucet)
└── 6 decimal precision
```

---

## 🔧 Installation

### Prerequisites

- Node.js 18+ 
- npm/yarn/bun
- Git
- MetaMask or compatible Web3 wallet

### Setup

```bash
# Clone repository
git clone https://github.com/johnnyduo/x402-streamflow.git
cd x402-streamflow

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

### Environment Variables

Create `.env` file in project root:

```env
# Required - Get your own from https://cloud.reown.com
VITE_REOWN_PROJECT_ID=your_reown_project_id_here

# Optional (for local development)
VITE_IOTA_RPC_URL=https://json-rpc.evm.testnet.iotaledger.net
VITE_CHAIN_ID=1076
```

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint
npm run lint
```

---

## 📜 Smart Contracts

### Deployed Addresses (IOTA EVM Testnet)

| Contract | Address | Explorer |
|----------|---------|----------|
| X402StreamingPayments | `0x340DeE0a3EA33304C59d15d37D951A5B72A7b563` | [View](https://explorer.evm.testnet.iotaledger.net/address/0x340DeE0a3EA33304C59d15d37D951A5B72A7b563) |
| EIP8004AgentRegistry | `0xcd5709C04D9Ffb775cb5eF492a7512C9B3f15631` | [View](https://explorer.evm.testnet.iotaledger.net/address/0xcd5709C04D9Ffb775cb5eF492a7512C9B3f15631) |
| USDC (Testnet) | `0x1ce14fD9dd6678fC3d192f02207d6ff999B04037` | [View](https://explorer.evm.testnet.iotaledger.net/address/0x1ce14fD9dd6678fC3d192f02207d6ff999B04037) |

### Key Functions

**X402StreamingPayments.sol**

```solidity
// Register new agent (requires AgentRegistry NFT ownership)
function registerAgent(uint256 agentId, address wallet, uint256 pricePerSecond)

// Create streaming payment
function createStream(uint256 agentId, uint256 durationSeconds) returns (uint256 streamId)

// Claim accumulated payments (with 0.5% platform fee)
function claimStream(uint256 streamId) returns (uint256 amount)

// Pause/Cancel streams
function pauseStream(uint256 streamId)
function cancelStream(uint256 streamId)

// View functions
function getStreamDetails(uint256 streamId) returns (...)
function getAgentStats(uint256 agentId) returns (...)
function activeStreams(address user, uint256 agentId) returns (uint256 streamId)
```

**EIP8004AgentRegistry.sol**

```solidity
// Register new agent (mints NFT)
function register(string uri, string metadata) returns (uint256 tokenId)

// Update agent metadata
function updateMetadata(uint256 tokenId, string metadata)

// Get agent info
function getAgent(uint256 tokenId) returns (uri, metadata, timestamp)
```

**USDC.sol**

```solidity
// Mint testnet USDC (faucet)
function mint(address to, uint256 amount)

// Check if can claim (24hr cooldown)
function canClaim(address account) returns (bool)
function lastClaimTime(address account) returns (uint256)
```

---

## 🌐 API Endpoints

API endpoints are deployed as Vercel Edge Functions in the `/api` directory.

### Available Endpoints

```
GET  /api/agents/signal-forge        # Trading signals
GET  /api/agents/volatility-pulse    # Volatility metrics  
GET  /api/agents/arb-navigator       # Arbitrage opportunities
GET  /api/agents/sentiment-radar     # Social sentiment
GET  /api/agents/risk-sentinel       # Risk scores
GET  /api/agents/ai-crawler          # Crawler stats
```

### Response Format

```json
{
  "status": "success",
  "agentId": 1,
  "timestamp": 1731782400,
  "data": {
    // Agent-specific data
  }
}
```

---

## 🎨 Component Structure

```
src/
├── components/
│   ├── AgentCard.tsx              # Individual agent display
│   ├── AgentStreamToggle.tsx      # Stream control widget
│   ├── StreamingPaymentControl.tsx # Modal for stream management
│   ├── Navigation.tsx             # Top nav with wallet & faucet
│   └── ui/                        # shadcn components
├── pages/
│   ├── Index.tsx                  # Landing page
│   ├── Developers.tsx             # Agent dashboard (main)
│   ├── Streams.tsx                # ReactFlow visualization
│   ├── Flow.tsx                   # Flow hub page
│   └── Admin.tsx                  # Settings & registration
├── hooks/
│   ├── useAgentStreamStatus.ts    # On-chain stream status
│   ├── useStreamingPayments.ts    # Payment operations
│   └── useAgentRegistry.ts        # Agent management
├── config/
│   ├── streamingContracts.ts      # Contract ABIs & addresses
│   └── contracts.ts               # USDC config
└── data/
    └── agents.tsx                 # Agent metadata
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Project Settings → Environment Variables
```

### Manual Build

```bash
# Build static assets
npm run build

# Deploy /dist folder to any static host
# (Netlify, Cloudflare Pages, AWS S3, etc.)
```

---

## 🧪 Testing

### Test USDC Faucet

1. Connect wallet to IOTA EVM Testnet
2. Navigate to any page with Navigation component
3. Click "Claim 100 USDC" button
4. Confirm transaction in wallet
5. Wait 24 hours for cooldown to reset

### Test Agent Streaming

1. Go to Agents page (`/agents`)
2. Select an agent and click **Register Agent** (first time only)
3. After registration, click **Activate Stream**
4. Enter stream duration (1-24 hours)
5. Approve USDC spending
6. Confirm stream creation
7. Watch real-time accumulation in agent cards
8. Navigate to Streams page to see flow visualization

---

## 📊 Stream Economics

### Cost Calculation

```
Cost per Hour = pricePerSecond × 3600
Cost per Day = pricePerSecond × 86400

Example (Signal Forge @ 0.001 USDC/sec):
- 1 hour = 3.6 USDC
- 1 day = 86.4 USDC
- 1 month = 2,592 USDC
```

### Gas Costs (IOTA EVM Testnet)

| Operation | Estimated Gas | Cost (at 10 Gwei) |
|-----------|---------------|-------------------|
| Create Stream | ~150,000 | ~$0.001 |
| Claim Stream | ~80,000 | ~$0.0005 |
| Pause Stream | ~50,000 | ~$0.0003 |
| Cancel Stream | ~70,000 | ~$0.0004 |

---

## 🔐 Security

### Smart Contract Security

- ✅ Reentrancy guards on all state-changing functions
- ✅ Overflow protection (Solidity 0.8+)
- ✅ Access control for admin functions
- ✅ Input validation and bounds checking
- ✅ Emergency pause mechanism

### Frontend Security

- ✅ Type-safe contract interactions (wagmi + viem)
- ✅ Transaction simulation before execution
- ✅ User confirmation for all state changes
- ✅ Secure wallet connection (WalletConnect v2)
- ✅ localStorage with address scoping

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style (ESLint + Prettier)
- Write TypeScript with strict mode
- Add JSDoc comments for public functions
- Test on IOTA EVM Testnet before submitting
- Update README if adding new features

---

## 📝 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **IOTA Foundation** - For IOTA EVM infrastructure
- **Reown (WalletConnect)** - For wallet connection protocol
- **shadcn** - For beautiful UI components
- **OpenZeppelin** - For secure contract primitives
- **Vercel** - For seamless deployment

---

## 🗺️ Roadmap

### Phase 1: Q4 2025
- ✅ Complete agent registry integration (EIP-8004)
- ✅ Add wallet connector (IOTA)
- ✅ Move Expansion
- [ ] Full x402 on-chain payment streams
- [ ] Live ReactFlow orchestration for task graphs

### Phase 2: Q1 2026
- [ ] Full x402 on-chain payment streams
- [ ] Live ReactFlow orchestration for task graphs

### Phase 3: Q2 2026
- [ ] Tokenized Agent Marketplace
- [ ] DeFi workflow templates (MM bots, liquidation bots, oracles, yield strategies)
- [ ] Cross-chain automation network

---

<div align="center">

**Built with ❤️ for the IOTA ecosystem**

⭐ Star us on GitHub if you find this project useful!

[Website](https://x402.cards) | [Docs](https://docs.x402.cards) | [Twitter](https://twitter.com/x402cards) | [Discord](https://discord.gg/x402)

</div>
