import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, polygon, arbitrum, base, optimism } from '@reown/appkit/networks'
import { defineChain } from 'viem'

// 1. Get projectId from environment
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID

if (!projectId) {
  throw new Error('VITE_REOWN_PROJECT_ID is not set')
}

// Define IOTA EVM Testnet
export const iotaEVM = defineChain({
  id: 1076,
  name: 'IOTA EVM Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IOTA',
    symbol: 'IOTA',
  },
  rpcUrls: {
    default: {
      http: ['https://json-rpc.evm.testnet.iota.cafe', 'https://rpc.ankr.com/iota_evm_testnet'],
    },
    public: {
      http: ['https://json-rpc.evm.testnet.iota.cafe', 'https://rpc.ankr.com/iota_evm_testnet'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'IOTA EVM Testnet Explorer', 
      url: 'https://explorer.evm.testnet.iota.cafe' 
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1,
    },
  },
  testnet: true,
})

// 2. Set up Wagmi adapter with IOTA EVM as primary network
export const networks = [iotaEVM, mainnet, polygon, arbitrum, base, optimism]

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
})

// 3. Create AppKit instance
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  defaultNetwork: iotaEVM,
  features: {
    analytics: true,
  },
  metadata: {
    name: 'x402.Cards',
    description: 'Autonomous Streaming Intelligence Dashboard powered by IOTA EVM & x402',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://x402.cards',
    icons: ['https://x402.cards/icon.png']
  }
})

export const config = wagmiAdapter.wagmiConfig
