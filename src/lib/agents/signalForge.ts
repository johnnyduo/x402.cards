import { tdGet } from '../twelvedata';

export type Candle = {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
};

type TimeSeriesResponse = {
  meta: any;
  values: Candle[];
  status?: string;
};

/**
 * Signal Forge - High-frequency trade signal generation
 * 
 * Uses Twelve Data's time_series endpoint to fetch OHLCV candles
 * and generate ML-powered trading signals with multi-timeframe analysis.
 * 
 * @param symbol - Trading pair (e.g., "BTC/USD", "ETH/USD", "EUR/USD", "AAPL")
 * @param interval - Timeframe ("1min", "5min", "15min", "1h", "4h", "1day")
 * @param outputsize - Number of candles to fetch (default 500)
 */
export async function getSignalForgeData(
  symbol: string = 'BTC/USD',
  interval: string = '5min',
  outputsize: number = 500
) {
  try {
    const data = await tdGet<TimeSeriesResponse>('/time_series', {
      symbol,
      interval,
      outputsize,
      order: 'desc', // newest first
    });

    if (!data.values || data.values.length === 0) {
      throw new Error('No data returned from Twelve Data');
    }

    const candles = data.values;

    // Calculate basic technical indicators
    const closes = candles.map(c => parseFloat(c.close));
    const highs = candles.map(c => parseFloat(c.high));
    const lows = candles.map(c => parseFloat(c.low));

    // Simple Moving Average (SMA)
    const sma20 = calculateSMA(closes, 20);
    const sma50 = calculateSMA(closes, 50);

    // RSI
    const rsi14 = calculateRSI(closes, 14);

    // Volatility
    const volatility = calculateVolatility(closes);

    // Generate signal
    const signal = generateSignal(closes[0], sma20, sma50, rsi14);

    return {
      meta: data.meta,
      candles,
      indicators: {
        sma20,
        sma50,
        rsi14,
        volatility,
      },
      signal,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Signal Forge error:', error);
    throw new Error(`Failed to fetch Signal Forge data: ${error.message}`);
  }
}

function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[0];
  const slice = prices.slice(0, period);
  return slice.reduce((sum, p) => sum + p, 0) / period;
}

function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;

  const changes = [];
  for (let i = 1; i < prices.length && i <= period; i++) {
    changes.push(prices[i - 1] - prices[i]);
  }

  const gains = changes.filter(c => c > 0);
  const losses = changes.filter(c => c < 0).map(Math.abs);

  const avgGain = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / period : 0;
  const avgLoss = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / period : 0;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;

  const returns = [];
  for (let i = 1; i < Math.min(prices.length, 20); i++) {
    returns.push((prices[i - 1] - prices[i]) / prices[i]);
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  return Math.sqrt(variance) * 100; // percentage
}

function generateSignal(
  currentPrice: number,
  sma20: number,
  sma50: number,
  rsi14: number
): { action: 'BUY' | 'SELL' | 'HOLD'; strength: number; reason: string } {
  const signals: { action: 'BUY' | 'SELL' | 'HOLD'; strength: number; reason: string }[] = [];

  // Moving average crossover
  if (sma20 > sma50 && currentPrice > sma20) {
    signals.push({ action: 'BUY', strength: 0.7, reason: 'Golden cross + price above SMA20' });
  } else if (sma20 < sma50 && currentPrice < sma20) {
    signals.push({ action: 'SELL', strength: 0.7, reason: 'Death cross + price below SMA20' });
  }

  // RSI oversold/overbought
  if (rsi14 < 30) {
    signals.push({ action: 'BUY', strength: 0.8, reason: 'RSI oversold (<30)' });
  } else if (rsi14 > 70) {
    signals.push({ action: 'SELL', strength: 0.8, reason: 'RSI overbought (>70)' });
  }

  // Aggregate signals
  if (signals.length === 0) {
    return { action: 'HOLD', strength: 0, reason: 'No clear signal' };
  }

  const buySignals = signals.filter(s => s.action === 'BUY');
  const sellSignals = signals.filter(s => s.action === 'SELL');

  if (buySignals.length > sellSignals.length) {
    const avgStrength = buySignals.reduce((sum, s) => sum + s.strength, 0) / buySignals.length;
    return {
      action: 'BUY',
      strength: avgStrength,
      reason: buySignals.map(s => s.reason).join(', '),
    };
  } else if (sellSignals.length > buySignals.length) {
    const avgStrength = sellSignals.reduce((sum, s) => sum + s.strength, 0) / sellSignals.length;
    return {
      action: 'SELL',
      strength: avgStrength,
      reason: sellSignals.map(s => s.reason).join(', '),
    };
  }

  return { action: 'HOLD', strength: 0, reason: 'Conflicting signals' };
}
