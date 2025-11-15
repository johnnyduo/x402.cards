// Contract addresses (IOTA EVM Testnet)
export const STREAMING_PAYMENTS_ADDRESS = "0x37E141fF46c431D8B8C781f0f1d9b6E1A88d93b9" as `0x${string}`;
export const AGENT_REGISTRY_ADDRESS = "0xA3630777E25021B1DA2b5BA0a5F5Eed0bB5f0c0d" as `0x${string}`;

// ABI for streaming payments contract
export const STREAMING_PAYMENTS_ABI = [
  // Agent Management
  {
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "wallet", type: "address" },
      { name: "pricePerSecond", type: "uint256" }
    ],
    name: "registerAgent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  // Stream Management
  {
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "duration", type: "uint256" }
    ],
    name: "createStream",
    outputs: [{ name: "streamId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "streamId", type: "uint256" }],
    name: "claimStream",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "streamId", type: "uint256" }],
    name: "pauseStream",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "streamId", type: "uint256" }],
    name: "cancelStream",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  // View Functions
  {
    inputs: [{ name: "streamId", type: "uint256" }],
    name: "getClaimableAmount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "streamId", type: "uint256" }],
    name: "getStreamDetails",
    outputs: [
      { name: "payer", type: "address" },
      { name: "agentId", type: "uint256" },
      { name: "agentWallet", type: "address" },
      { name: "amountPerSecond", type: "uint256" },
      { name: "startTime", type: "uint256" },
      { name: "endTime", type: "uint256" },
      { name: "totalPaid", type: "uint256" },
      { name: "claimable", type: "uint256" },
      { name: "active", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "agentId", type: "uint256" }],
    name: "getAgentStats",
    outputs: [
      { name: "wallet", type: "address" },
      { name: "pricePerSecond", type: "uint256" },
      { name: "isActive", type: "bool" },
      { name: "totalEarned", type: "uint256" },
      { name: "totalStreams", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "uint256" }
    ],
    name: "activeStreams",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "usdc",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "streamId", type: "uint256" },
      { indexed: true, name: "payer", type: "address" },
      { indexed: true, name: "agentId", type: "uint256" },
      { indexed: false, name: "amountPerSecond", type: "uint256" },
      { indexed: false, name: "duration", type: "uint256" }
    ],
    name: "StreamCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "streamId", type: "uint256" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "platformFee", type: "uint256" }
    ],
    name: "StreamClaimed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "streamId", type: "uint256" },
      { indexed: false, name: "refundAmount", type: "uint256" }
    ],
    name: "StreamCancelled",
    type: "event"
  }
] as const;
