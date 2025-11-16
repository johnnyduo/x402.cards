# X402StreamingPayments Deployment Guide

## 📋 Contract Addresses (IOTA EVM Testnet)

### ✅ Already Deployed:
- **USDC**: `0x1ce14fD9dd6678fC3d192f02207d6ff999B04037`
- **EIP8004AgentRegistry**: `0xcd5709C04D9Ffb775cb5eF492a7512C9B3f15631`
- **X402StreamingPayments**: `0x340DeE0a3EA33304C59d15d37D951A5B72A7b563`

---

## 🎯 Deployment Steps in Remix

### Step 1: Open Remix & Load Contract
1. Go to https://remix.ethereum.org
2. Create new file: `X402StreamingPayments.sol`
3. Copy the contract from `contracts/X402StreamingPayments.sol`

### Step 2: Compile Contract
1. Go to "Solidity Compiler" tab
2. Select Compiler: `0.8.26`
3. Enable Optimization: `200 runs`
4. Click "Compile X402StreamingPayments.sol"

### Step 3: Deploy Contract
1. Go to "Deploy & Run Transactions" tab
2. Environment: Select **"Injected Provider - MetaMask"**
3. Network: Switch MetaMask to **IOTA EVM Testnet**
   - Chain ID: `1076`
   - RPC: `https://json-rpc.evm.testnet.iotaledger.net`
   - Symbol: `IOTA`

4. **Constructor Parameters** (in order):
   ```
   _usdc: 0x1ce14fD9dd6678fC3d192f02207d6ff999B04037
   _agentRegistry: 0xcd5709C04D9Ffb775cb5eF492a7512C9B3f15631
   _platformFeeRecipient: [YOUR_WALLET_ADDRESS]
   ```

   Example with deployer wallet:
   ```
   _usdc: 0x1ce14fD9dd6678fC3d192f02207d6ff999B04037
   _agentRegistry: 0xcd5709C04D9Ffb775cb5eF492a7512C9B3f15631
   _platformFeeRecipient: 0x5ebaddf71482d40044391923be1fc42938129988
   ```

5. Click **"Deploy"**
6. Confirm transaction in MetaMask
7. Wait for confirmation (~5 seconds)
8. **Copy the deployed contract address** from Remix console

### Step 4: Verify Deployment (Optional)
Run these view functions in Remix:
- `usdc()` → should return `0x1ce14fD9dd6678fC3d192f02207d6ff999B04037`
- `agentRegistry()` → should return `0xcd5709C04D9Ffb775cb5eF492a7512C9B3f15631`
- `minPaymentAmount()` → should return `1000` (0.001 USDC)
- `platformFee()` → should return `250` (2.5%)

### Step 5: Update Frontend Configuration

After deployment, update **`src/config/streamingContracts.ts`**:

```typescript
// Contract addresses (IOTA EVM Testnet)
export const STREAMING_PAYMENTS_ADDRESS = "0x[NEW_DEPLOYED_ADDRESS]" as `0x${string}`;
export const AGENT_REGISTRY_ADDRESS = "0xcd5709C04D9Ffb775cb5eF492a7512C9B3f15631" as `0x${string}`;
```

---

## ✨ Post-Deployment Configuration (Optional)

If you want to adjust settings, call these functions:

### 1. Set Minimum Payment Amount
```solidity
setMinPaymentAmount(1000)  // 0.001 USDC per second
```

### 2. Set Platform Fee
```solidity
setPlatformFee(250)  // 2.5% (250 basis points)
```

### 3. Update Platform Fee Recipient
```solidity
updatePlatformFeeRecipient(0xNEW_ADDRESS)
```

---

## 🧪 Testing Agent Registration

After deployment and frontend update:

1. Go to http://localhost:8080/admin
2. Connect your wallet
3. Select an agent (Signal Forge, Volatility Pulse, etc.)
4. Set price: `0.001` (minimum)
5. Set wallet address: Your receiving wallet
6. Click "Register Agent"
7. Confirm transaction in MetaMask
8. Check "Manage Agents" tab to see registered agent

---

## 📝 Important Notes

✅ **No Owner Restrictions**: `registerAgent()` is open to everyone - any user can register agents
✅ **Minimum Price**: 0.001 USDC per second (enforced by contract)
✅ **Platform Fee**: 2.5% of all streaming payments goes to platform
✅ **USDC Required**: Users need USDC on IOTA testnet to create streams

---

## 🔗 Useful Links

- **IOTA EVM Testnet Explorer**: https://explorer.evm.testnet.iotaledger.net
- **IOTA Testnet Faucet**: https://faucet.testnet.iotaledger.net
- **Remix IDE**: https://remix.ethereum.org

---

## 🆘 Troubleshooting

**Issue**: Transaction fails with "Price too low"
- **Solution**: Ensure price is at least 0.001 USDC per second

**Issue**: "Insufficient funds for gas"
- **Solution**: Get IOTA from testnet faucet

**Issue**: "Agent already registered"
- **Solution**: Agent ID is already taken, contract prevents duplicate registrations

**Issue**: Wrong network
- **Solution**: Switch MetaMask to IOTA EVM Testnet (Chain ID 1076)
