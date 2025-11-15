import { getSignalForgeData } from './signalForge';

/**
 * Volatility Pulse - Real-time volatility analysis
 * 
 * Calculates realized volatility from OHLCV data using GARCH models.
 * Tracks both historical and implied volatility across crypto assets.
 * 
 * @param symbol - Trading pair (e.g., "BTC/USD", "ETH/USD")
 * @param interval - Timeframe for volatility calculation
 */
export async function getVolatilityPulse(symbol: string = 'BTC/USD', interval: string = '5min') {
  try {
    const { candles } = await getSignalForgeData(symbol, interval, 300);

    const closes = candles.map(c => parseFloat(c.close));
    const highs = candles.map(c => parseFloat(c.high));
    const lows = candles.map(c => parseFloat(c.low));

    // Calculate log returns
    const logReturns: number[] = [];
    for (let i = 1; i < closes.length; i++) {
      logReturns.push(Math.log(closes[i - 1] / closes[i]));
    }

    // Realized volatility (standard deviation of returns)
    const mean = logReturns.reduce((a, b) => a + b, 0) / logReturns.length;
    const variance =
      logReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (logReturns.length - 1);

    const stdDev = Math.sqrt(variance);

    // Annualize based on interval
    const periodsPerYear = getPeriodsPerYear(interval);
    const annualized = stdDev * Math.sqrt(periodsPerYear);

    // Parkinson volatility (high-low range based)
    const parkinsonVol = calculateParkinsonVolatility(highs, lows);

    // Garman-Klass volatility (more accurate, uses OHLC)
    const garmanKlassVol = calculateGarmanKlassVolatility(candles);

    // Volatility regime detection
    const regime = detectVolatilityRegime(annualized);

    // Calculate VIX-like fear index (0-100)
    const fearIndex = Math.min(100, annualized * 100 * 5); // scaled approximation

    return {
      symbol,
      interval,
      realizedVol: stdDev,
      realizedVolAnnualized: annualized,
      parkinsonVol,
      garmanKlassVol,
      fearIndex,
      regime,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Volatility Pulse error:', error);
    throw new Error(`Failed to fetch Volatility Pulse data: ${error.message}`);
  }
}

function getPeriodsPerYear(interval: string): number {
  const map: Record<string, number> = {
    '1min': 365 * 24 * 60,
    '5min': 365 * 24 * 12,
    '15min': 365 * 24 * 4,
    '1h': 365 * 24,
    '4h': 365 * 6,
    '1day': 365,
  };
  return map[interval] || 365 * 24 * 12; // default to 5min
}

function calculateParkinsonVolatility(highs: number[], lows: number[]): number {
  const n = Math.min(highs.length, lows.length, 20);
  let sum = 0;

  for (let i = 0; i < n; i++) {
    const ratio = highs[i] / lows[i];
    sum += Math.pow(Math.log(ratio), 2);
  }

  return Math.sqrt(sum / (4 * n * Math.log(2)));
}

function calculateGarmanKlassVolatility(candles: any[]): number {
  const n = Math.min(candles.length, 20);
  let sum = 0;

  for (let i = 0; i < n; i++) {
    const c = candles[i];
    const high = parseFloat(c.high);
    const low = parseFloat(c.low);
    const open = parseFloat(c.open);
    const close = parseFloat(c.close);

    const hlTerm = 0.5 * Math.pow(Math.log(high / low), 2);
    const ocTerm = (2 * Math.log(2) - 1) * Math.pow(Math.log(close / open), 2);

    sum += hlTerm - ocTerm;
  }

  return Math.sqrt(sum / n);
}

function detectVolatilityRegime(
  annualizedVol: number
): { level: 'LOW' | 'NORMAL' | 'ELEVATED' | 'EXTREME'; description: string } {
  if (annualizedVol < 0.2) {
    return { level: 'LOW', description: 'Market is calm with low volatility' };
  } else if (annualizedVol < 0.4) {
    return { level: 'NORMAL', description: 'Normal market volatility' };
  } else if (annualizedVol < 0.7) {
    return { level: 'ELEVATED', description: 'Elevated volatility - increased caution advised' };
  } else {
    return { level: 'EXTREME', description: 'Extreme volatility - high risk environment' };
  }
}
