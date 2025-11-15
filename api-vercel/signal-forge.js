export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const TWELVEDATA_API_KEY = process.env.TWELVEDATA_API_KEY;

  try {
    const { symbol = 'BTC/USD', interval = '5min', outputsize = 500 } = req.query;

    const url = new URL('/time_series', 'https://api.twelvedata.com');
    url.searchParams.append('symbol', symbol);
    url.searchParams.append('interval', interval);
    url.searchParams.append('outputsize', outputsize);
    url.searchParams.append('order', 'desc');
    url.searchParams.append('apikey', TWELVEDATA_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message);
    }

    if (!data.values || data.values.length === 0) {
      throw new Error('No data returned');
    }

    const candles = data.values;
    const closes = candles.map(c => parseFloat(c.close));

    // Calculate indicators
    const sma20 = calculateSMA(closes, 20);
    const sma50 = calculateSMA(closes, 50);
    const rsi14 = calculateRSI(closes, 14);
    const volatility = calculateVolatility(closes);

    const signal = generateSignal(closes[0], sma20, sma50, rsi14);

    res.status(200).json({
      symbol,
      interval,
      currentPrice: closes[0],
      indicators: { sma20, sma50, rsi14, volatility },
      signal,
      candles: candles.slice(0, 100),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Signal Forge error:', error);
    res.status(500).json({ error: error.message });
  }
}

function calculateSMA(prices, period) {
  if (prices.length < period) return prices[0];
  const slice = prices.slice(0, period);
  return slice.reduce((sum, p) => sum + p, 0) / period;
}

function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) return 50;
  const changes = [];
  for (let i = 1; i <= period; i++) {
    changes.push(prices[i - 1] - prices[i]);
  }
  const gains = changes.filter(c => c > 0);
  const losses = changes.filter(c => c < 0).map(Math.abs);
  const avgGain = gains.reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.reduce((a, b) => a + b, 0) / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function calculateVolatility(prices) {
  if (prices.length < 2) return 0;
  const returns = [];
  for (let i = 1; i < Math.min(prices.length, 20); i++) {
    returns.push((prices[i - 1] - prices[i]) / prices[i]);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  return Math.sqrt(variance) * 100;
}

function generateSignal(currentPrice, sma20, sma50, rsi14) {
  const signals = [];
  
  if (sma20 > sma50 && currentPrice > sma20) {
    signals.push({ action: 'BUY', strength: 0.7, reason: 'Golden cross + price above SMA20' });
  } else if (sma20 < sma50 && currentPrice < sma20) {
    signals.push({ action: 'SELL', strength: 0.7, reason: 'Death cross + price below SMA20' });
  }
  
  if (rsi14 < 30) {
    signals.push({ action: 'BUY', strength: 0.8, reason: 'RSI oversold (<30)' });
  } else if (rsi14 > 70) {
    signals.push({ action: 'SELL', strength: 0.8, reason: 'RSI overbought (>70)' });
  }
  
  if (signals.length === 0) {
    return { action: 'HOLD', strength: 0, reason: 'No clear signal' };
  }
  
  const buySignals = signals.filter(s => s.action === 'BUY');
  const sellSignals = signals.filter(s => s.action === 'SELL');
  
  if (buySignals.length > sellSignals.length) {
    return {
      action: 'BUY',
      strength: buySignals.reduce((sum, s) => sum + s.strength, 0) / buySignals.length,
      reason: buySignals.map(s => s.reason).join(', '),
    };
  } else if (sellSignals.length > buySignals.length) {
    return {
      action: 'SELL',
      strength: sellSignals.reduce((sum, s) => sum + s.strength, 0) / sellSignals.length,
      reason: sellSignals.map(s => s.reason).join(', '),
    };
  }
  
  return { action: 'HOLD', strength: 0, reason: 'Conflicting signals' };
}
