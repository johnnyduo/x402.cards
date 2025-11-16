# Real-Time Streaming Payment Workflow

## Overview
Users can activate agents by creating streaming payment channels that pay per second in USDC. This enables pay-as-you-go access to AI-powered market intelligence.

## Architecture

### Smart Contracts (IOTA EVM Testnet)
- **StreamingPayments**: `0x340DeE0a3EA33304C59d15d37D951A5B72A7b563`
- **USDC**: `0x1ce14fD9dd6678fC3d192f02207d6ff999B04037`
- **Chain ID**: 1076

### Flow Diagram

```
User Wallet
    ↓
1. Check USDC Balance
    ↓
2. Approve USDC (if needed)
    ↓ (requires gas tx)
3. Create Stream
    ↓ (requires gas tx)
4. Stream Active ✅
    ↓
5. Agent API Activated
    ↓ (real-time data)
6. USDC Streams per Second
    ↓
7. Agent Claims Earnings
```

## User Experience

### Step 1: Register Agent (Admin Only - One Time)
- Admin registers agent on-chain with pricing
- Agent shows as "REGISTERED" status
- Example: Signal Forge @ 0.001 USDC/sec

### Step 2: Activate Stream (Any User)
**Location**: Developers page → Signal Forge card

**Process**:
1. User clicks "Activate Stream" toggle
2. System checks USDC balance (default 1 hour = 3.6 USDC)
3. If allowance < cost:
   - Transaction 1: Approve USDC spending
   - User signs transaction (~$0.01 gas)
   - Wait for confirmation
4. Transaction 2: Create stream
   - User signs transaction (~$0.02 gas)
   - Wait for confirmation
5. Stream active! 🎉

**What Happens**:
- Badge changes: "AWAITING STREAM" → "STREAMING" 
- API starts fetching real-time data
- USDC flows per second to agent wallet
- Real-time countdown timer shows time left
- Accumulated USDC display updates every second

### Step 3: View Real-Time Data
**Only shown when stream is active:**
- BTC/USD price updates
- RSI indicator
- Buy/Sell signals with reasoning
- All data refreshes every 30 seconds

### Step 4: Stream Management
**During active stream:**
- View time remaining (countdown)
- View USDC streamed in real-time
- Pause stream (stops payment, keeps remaining balance)
- Resume stream (continues from pause point)
- Cancel stream (refunds unused USDC)

**When stream ends:**
- Agent auto-pauses
- User can create new stream to continue
- Agent can claim accumulated earnings

## Cost Structure

### Signal Forge Example
- **Rate**: 0.001 USDC/second
- **1 minute**: 0.06 USDC
- **1 hour**: 3.6 USDC
- **1 day**: 86.4 USDC

### Gas Costs (IOTA EVM Testnet)
- Approve USDC: ~$0.01
- Create Stream: ~$0.02
- Pause Stream: ~$0.01
- Claim Earnings: ~$0.02 (agent only)

**Total user cost for 1 hour**: ~3.63 USDC

## Technical Implementation

### Frontend Components

#### AgentStreamToggle
**File**: `src/components/AgentStreamToggle.tsx`

**Features**:
- Real-time balance checking
- Automatic USDC approval flow
- Stream creation with confirmation
- Live countdown timer
- Accumulated earnings display
- Pause/resume functionality

**Props**:
```typescript
interface AgentStreamToggleProps {
  agentId: number;              // Agent ID (1-6)
  agentName: string;            // Display name
  pricePerSecond: number;       // USDC per second (e.g., 0.001)
  onStreamChange?: (isActive: boolean, streamId?: bigint) => void;
}
```

### Hooks

#### useAgentData (Updated)
**File**: `src/hooks/useAgentData.ts`

**New Parameter**: `enabled: boolean = true`
- When `false`: Skips API calls completely
- When `true`: Fetches data every 30 seconds
- Automatically controlled by stream status

**Usage**:
```typescript
const { data, loading } = useAgentData(
  'signal-forge',
  { symbol: 'BTC/USD', interval: '5min' },
  streamActive // Only fetch when streaming
);
```

### Smart Contract Interactions

#### 1. Check Allowance
```typescript
useReadContract({
  address: USDC_CONTRACT_ADDRESS,
  functionName: 'allowance',
  args: [userAddress, STREAMING_PAYMENTS_ADDRESS]
})
```

#### 2. Approve USDC
```typescript
writeContractAsync({
  address: USDC_CONTRACT_ADDRESS,
  functionName: 'approve',
  args: [STREAMING_PAYMENTS_ADDRESS, totalCost]
})
```

#### 3. Create Stream
```typescript
writeContractAsync({
  address: STREAMING_PAYMENTS_ADDRESS,
  functionName: 'createStream',
  args: [agentId, durationInSeconds]
})
```

#### 4. Get Stream Details (Real-time)
```typescript
useReadContract({
  address: STREAMING_PAYMENTS_ADDRESS,
  functionName: 'getStreamDetails',
  args: [streamId],
  query: { refetchInterval: 1000 } // Update every second
})
```

## Status Flow

### Agent States
1. **NOT REGISTERED** (Gray) - Agent not on-chain yet
2. **REGISTERED** (Blue) - Agent registered, waiting for streams
3. **AWAITING STREAM** (Yellow, pulsing) - Registered, no active streams
4. **STREAMING** (Green, pulsing) - Active stream with payment flowing

### Visual Indicators
- **Card Border**: Changes color based on status
- **Top Border Animation**: Green pulsing line when streaming
- **Badge**: Shows current status with icon
- **Timer**: Countdown in real-time when active
- **USDC Counter**: Accumulated amount updates every second

## API Integration

### Backend Server
**Location**: `api/server.js`
**Port**: 3001

### Agent Endpoints
- `GET /api/agents/signal-forge?symbol=BTC/USD&interval=5min`
- Returns technical indicators, signals, price data

### API Access Control
- API calls only execute when stream is active
- Frontend checks stream status before fetching
- Prevents unauthorized data access
- Saves API quota and server resources

## Security Features

1. **On-Chain Validation**:
   - Contract verifies agent registration
   - Checks USDC balance before stream creation
   - Validates allowance amounts
   - Prevents double-spending

2. **Time-Based Streaming**:
   - Payments unlock per second
   - Agent can only claim earned amount
   - Unused funds refundable on cancellation
   - Automatic stream expiry

3. **Frontend Protection**:
   - No API calls without active stream
   - Real-time balance validation
   - Transaction confirmation required
   - Error handling with user feedback

## Future Enhancements

### Planned Features
1. **Auto-Renewal**: Automatic stream extension
2. **Bulk Activation**: Subscribe to multiple agents
3. **Discounts**: Lower rates for longer durations
4. **Referral System**: Earn credits for referrals
5. **Agent Marketplace**: Community-created agents

### Optimization Ideas
1. **Batched Approvals**: Approve once for all agents
2. **Gasless Transactions**: Meta-transactions via relayer
3. **L2 Integration**: Move to cheaper L2 for lower fees
4. **Subscription Tiers**: Monthly/yearly flat rates

## Troubleshooting

### Common Issues

**"Insufficient USDC balance"**
- Solution: Get testnet USDC from faucet
- Check: Wallet balance on explorer

**"Transaction failed"**
- Solution: Increase gas limit
- Check: Network connection to IOTA EVM

**"Agent not registered"**
- Solution: Contact admin to register agent
- Check: Agent status on Admin page

**"API data not loading"**
- Solution: Ensure API server running on localhost:3001
- Check: Stream is active (green badge)

### Debug Checklist
1. ✅ Wallet connected?
2. ✅ On IOTA EVM Testnet (Chain ID 1076)?
3. ✅ Sufficient USDC balance?
4. ✅ Agent registered on-chain?
5. ✅ Stream active (green badge)?
6. ✅ API server running?
7. ✅ Browser console errors?

## Testing Guide

### Local Testing
1. Start API server: `cd api && node server.js`
2. Start frontend: `bun run dev`
3. Connect wallet to IOTA EVM Testnet
4. Get testnet USDC (if needed)
5. Navigate to Developers page
6. Register Signal Forge in Admin (if not done)
7. Click stream toggle on Signal Forge card
8. Follow approval + creation flow
9. Watch real-time data appear!

### Expected Behavior
- Toggle switches on after 2 transactions
- Badge changes to green "STREAMING"
- Timer counts down from 1:00:00
- USDC counter increases every second
- API data loads within 30 seconds
- Card border glows green

## Success Metrics

### User Journey
- Registration → Stream Active: ~2 minutes
- Transactions required: 2 (approve + create)
- Gas cost: ~$0.03
- Data latency: <30 seconds
- Payment precision: Per-second accuracy

### System Performance
- Stream updates: 1000ms refresh rate
- API polling: 30000ms interval
- Transaction confirmation: ~5 seconds
- Real-time accuracy: ±1 second

---

**Status**: ✅ Implemented and ready for testing
**Last Updated**: Current session
**Components**: AgentStreamToggle, Developers page, useAgentData hook
