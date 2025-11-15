import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    iotaTestnet: {
      url: "https://json-rpc.evm.testnet.iota.cafe",
      chainId: 1076,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      iotaTestnet: "no-api-key-needed",
    },
    customChains: [
      {
        network: "iotaTestnet",
        chainId: 1076,
        urls: {
          apiURL: "https://explorer.evm.testnet.iota.cafe/api",
          browserURL: "https://explorer.evm.testnet.iota.cafe",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
