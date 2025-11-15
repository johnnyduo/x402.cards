import { tdGet } from '../twelvedata';

type QuoteResponse = {
  symbol: string;
  name?: string;
  price: string;
  currency?: string;
  timestamp: number;
  exchange?: string;
};

/**
 * Arb Navigator - Cross-venue arbitrage opportunity detection
 * 
 * Monitors price discrepancies across multiple trading venues
 * and calculates profitable arbitrage opportunities.
 * 
 * @param symbols - Array of trading pairs to monitor
 */
export async function getArbNavigatorData(symbols: string[] = ['BTC/USD', 'ETH/USD']) {
  try {
    // Fetch quotes for all symbols
    const symbolStr = symbols.join(',');
    const data = await tdGet<Record<string, QuoteResponse>>('/quote', {
      symbol: symbolStr,
    });

    const quotes = Object.values(data);

    if (quotes.length === 0) {
      throw new Error('No quotes returned');
    }

    // Calculate cross-pair arbitrage opportunities
    const opportunities = [];

    for (let i = 0; i < quotes.length; i++) {
      for (let j = i + 1; j < quotes.length; j++) {
        const q1 = quotes[i];
        const q2 = quotes[j];

        const price1 = parseFloat(q1.price);
        const price2 = parseFloat(q2.price);

        // For same-type pairs (both crypto or both fiat), calculate spread
        if (areSimilarAssets(q1.symbol, q2.symbol)) {
          const spreadAbs = Math.abs(price1 - price2);
          const spreadPct = (spreadAbs / Math.min(price1, price2)) * 100;

          // Only include if spread > 0.1%
          if (spreadPct > 0.1) {
            opportunities.push({
              pair: [q1.symbol, q2.symbol],
              prices: [price1, price2],
              spreadAbs,
              spreadPct,
              direction: price1 > price2 ? 'BUY_Q2_SELL_Q1' : 'BUY_Q1_SELL_Q2',
              profitability: calculateProfitability(spreadPct),
            });
          }
        }
      }
    }

    // Sort by profitability
    opportunities.sort((a, b) => b.spreadPct - a.spreadPct);

    // Calculate total market efficiency score
    const avgSpread =
      opportunities.reduce((sum, o) => sum + o.spreadPct, 0) / (opportunities.length || 1);
    const efficiencyScore = Math.max(0, 100 - avgSpread * 20);

    return {
      quotes,
      opportunities: opportunities.slice(0, 10), // top 10
      summary: {
        totalOpportunities: opportunities.length,
        avgSpread,
        efficiencyScore,
        topOpportunity: opportunities[0] || null,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Arb Navigator error:', error);
    throw new Error(`Failed to fetch Arb Navigator data: ${error.message}`);
  }
}

/**
 * Calculate gas-optimized arbitrage routes
 * @param opportunities - List of arbitrage opportunities
 * @param gasPrice - Current gas price in gwei
 */
export function calculateOptimalRoute(
  opportunities: any[],
  gasPrice: number = 20
): {
  route: string[];
  expectedProfit: number;
  gasCost: number;
  netProfit: number;
} {
  if (opportunities.length === 0) {
    return { route: [], expectedProfit: 0, gasCost: 0, netProfit: 0 };
  }

  const top = opportunities[0];
  
  // Simplified gas calculation (2 swaps + bridge if cross-chain)
  const baseGas = 150000; // gas units per swap
  const gasCostUSD = (baseGas * 2 * gasPrice * 0.000000001) * 3000; // assuming ETH = $3000

  const tradeSize = 10000; // $10k trade
  const expectedProfit = (top.spreadPct / 100) * tradeSize;
  const netProfit = expectedProfit - gasCostUSD;

  return {
    route: top.pair,
    expectedProfit,
    gasCost: gasCostUSD,
    netProfit,
  };
}

function areSimilarAssets(symbol1: string, symbol2: string): boolean {
  // Extract base currency from pairs like "BTC/USD", "ETH/USDT"
  const base1 = symbol1.split('/')[0];
  const base2 = symbol2.split('/')[0];

  // Same base currency = comparable
  return base1 === base2;
}

function calculateProfitability(
  spreadPct: number
): { score: number; rating: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME' } {
  if (spreadPct < 0.5) {
    return { score: spreadPct * 20, rating: 'LOW' };
  } else if (spreadPct < 1.5) {
    return { score: 40 + spreadPct * 20, rating: 'MEDIUM' };
  } else if (spreadPct < 3) {
    return { score: 70 + spreadPct * 10, rating: 'HIGH' };
  } else {
    return { score: 95 + Math.min(5, spreadPct), rating: 'EXTREME' };
  }
}
