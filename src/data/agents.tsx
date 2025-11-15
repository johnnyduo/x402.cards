import { Activity, TrendingUp, GitBranch, Heart, Shield, Sparkles } from 'lucide-react';

export interface Agent {
  id: number;
  name: string;
  category: string;
  description: string;
  pricePerSec: number;
  icon: React.ReactNode;
  features: string[];
  dataSources?: string[];
  methodology?: string;
  apiEndpoint?: string;
}

/**
 * x402 AI Agent Registry
 * 
 * This is the canonical source of truth for all AI agents available on the x402 platform.
 * These agents are registered on-chain via EIP-8004 Agent Registry contract.
 * 
 * Data Sources & Methodology:
 * - All agents utilize real-time blockchain data from IOTA EVM
 * - Market data aggregated from DEXs, CEXs, and oracle networks
 * - Sentiment analysis from Twitter, Telegram, Discord, and trading forums
 * - On-chain analytics from smart contract interactions and wallet behaviors
 */
export const AGENTS: Agent[] = [
  {
    id: 1,
    name: 'Signal Forge',
    category: 'SIGNALS',
    description: 'Sculpts high-frequency trade entries with adaptive quants.',
    pricePerSec: 0.0002,
    icon: <Activity className="w-5 h-5" />,
    features: [
      'Multi-timeframe pattern detection',
      'ML-powered signal generation',
      'Risk-adjusted entry/exit points',
      'Backtested strategy metrics',
    ],
    dataSources: [
      'IOTA EVM on-chain transaction data',
      'Multi-DEX price feeds (Uniswap, Sushiswap, PancakeSwap)',
      'Historical OHLCV data from CoinGecko & CoinMarketCap',
      'Order book depth analysis from major exchanges',
    ],
    methodology: 'Uses ensemble ML models combining LSTM, Transformer, and GBM algorithms trained on 3+ years of historical data. Signals are generated using multi-timeframe confluence analysis (1m, 5m, 15m, 1h, 4h).',
    apiEndpoint: '/api/agents/signal-forge',
  },
  {
    id: 2,
    name: 'Volatility Pulse',
    category: 'VOLATILITY',
    description: 'Detects turbulence spikes across majors & synths.',
    pricePerSec: 0.0002,
    icon: <TrendingUp className="w-5 h-5" />,
    features: [
      'Real-time VIX tracking',
      'Volatility forecasting models',
      'Cross-market correlation analysis',
      'Historical volatility comparisons',
    ],
    dataSources: [
      'CBOE VIX Index real-time feed',
      'Implied volatility from options markets (Deribit, Paradigm)',
      'Realized volatility calculations from spot markets',
      'Crypto Fear & Greed Index',
    ],
    methodology: 'Implements GARCH and EGARCH models for volatility forecasting. Tracks both historical and implied volatility across major crypto assets. Uses correlation matrices to detect contagion patterns.',
    apiEndpoint: '/api/agents/volatility-pulse',
  },
  {
    id: 3,
    name: 'Arb Navigator',
    category: 'ARBITRAGE',
    description: 'Plots cross-venue price corridors & neutral legs.',
    pricePerSec: 0.0002,
    icon: <GitBranch className="w-5 h-5" />,
    features: [
      'Multi-DEX price monitoring',
      'Gas-optimized route finding',
      'Flash loan opportunity detection',
      'Slippage impact calculations',
    ],
    dataSources: [
      'Real-time DEX liquidity pool data (Uniswap V2/V3, Curve, Balancer)',
      'CEX orderbook snapshots (Binance, Coinbase, Kraken)',
      'Gas price oracles (EthGasStation, Blocknative)',
      'Bridge liquidity and cross-chain price feeds',
    ],
    methodology: 'Employs Bellman-Ford algorithm for negative cycle detection across trading venues. Calculates optimal routing considering gas costs, slippage, and execution time. MEV-aware execution strategies.',
    apiEndpoint: '/api/agents/arb-navigator',
  },
  {
    id: 4,
    name: 'Sentiment Radar',
    category: 'SENTIMENT',
    description: 'Scrapes macro narratives & crowd mood vectors.',
    pricePerSec: 0.0002,
    icon: <Heart className="w-5 h-5" />,
    features: [
      'Multi-platform sentiment aggregation',
      'AI-powered emotion detection',
      'Influencer impact tracking',
      'Trending topic alerts',
    ],
    dataSources: [
      'Twitter/X API v2 - real-time crypto tweets and engagement',
      'Reddit API - r/CryptoCurrency, r/Bitcoin, r/ethereum sentiment',
      'Telegram crypto group messages and reactions',
      'Discord trading communities (sentiment via NLP)',
      'News aggregators (CoinDesk, CoinTelegraph, Bloomberg Crypto)',
    ],
    methodology: 'Leverages fine-tuned BERT and GPT models for crypto-specific sentiment classification. Implements influencer scoring algorithm based on follower count, engagement rate, and historical accuracy. Real-time topic modeling using LDA.',
    apiEndpoint: '/api/agents/sentiment-radar',
  },
  {
    id: 5,
    name: 'Risk Sentinel',
    category: 'RISK',
    description: 'Scores systemic debt & collateral exposures.',
    pricePerSec: 0.0002,
    icon: <Shield className="w-5 h-5" />,
    features: [
      'Real-time liquidation risk scoring',
      'Portfolio health monitoring',
      'Collateral ratio tracking',
      'Smart contract risk analysis',
    ],
    dataSources: [
      'DeFi lending protocol data (Aave, Compound, MakerDAO)',
      'Collateral position monitoring via smart contract events',
      'Oracle price feeds (Chainlink, Pyth, Band Protocol)',
      'Historical liquidation events and cascades',
      'Smart contract audit reports and vulnerability databases',
    ],
    methodology: 'Implements Value-at-Risk (VaR) and Expected Shortfall (ES) calculations. Monitors health factors across major DeFi protocols. Uses simulation models for stress testing under extreme market conditions. Smart contract risk assessment via static analysis and formal verification.',
    apiEndpoint: '/api/agents/risk-sentinel',
  },
  {
    id: 6,
    name: 'AI Crawler Service',
    category: 'REVENUE',
    description: 'Deploy AI crawlers to earn passive income from data collection.',
    pricePerSec: 0.0003,
    icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
    features: [
      'Automated web data collection',
      'Real-time content indexing',
      'API monetization streams',
      'Earn 0.0003 USDC/sec per crawler',
    ],
    dataSources: [
      'Custom web scraping targets (configurable)',
      'Blockchain indexing (events, transactions, state changes)',
      'Social media APIs (Twitter, Reddit, Discord)',
      'RSS feeds and news aggregators',
      'Data marketplaces for monetization',
    ],
    methodology: 'Distributed crawler architecture with rate limiting and proxy rotation. Content deduplication using MinHash LSH. Automated data quality scoring. Built-in monetization layer that sells indexed data to AI training datasets and analytics platforms.',
    apiEndpoint: '/api/agents/ai-crawler',
  },
];

/**
 * Get agent by ID
 */
export const getAgentById = (id: number): Agent | undefined => {
  return AGENTS.find((agent) => agent.id === id);
};

/**
 * Get all agents by category
 */
export const getAgentsByCategory = (category: string): Agent[] => {
  return AGENTS.filter((agent) => agent.category === category);
};

/**
 * Get all unique categories
 */
export const getCategories = (): string[] => {
  return Array.from(new Set(AGENTS.map((agent) => agent.category)));
};
