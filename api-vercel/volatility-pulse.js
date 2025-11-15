export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const TWELVEDATA_API_KEY = process.env.TWELVEDATA_API_KEY;

  try {
    const { symbol = 'BTC/USD', interval = '5min' } = req.query;

    const url = new URL('/time_series', 'https://api.twelvedata.com');
    url.searchParams.append('symbol', symbol);
    url.searchParams.append('interval', interval);
    url.searchParams.append('outputsize', '300');
    url.searchParams.append('order', 'desc');
    url.searchParams.append('apikey', TWELVEDATA_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message);
    }

    const candles = data.values;
    const closes = candles.map(c => parseFloat(c.close));

    // Log returns
    const logReturns = [];
    for (let i = 1; i < closes.length; i++) {
      logReturns.push(Math.log(closes[i - 1] / closes[i]));
    }

    const mean = logReturns.reduce((a, b) => a + b, 0) / logReturns.length;
    const variance = logReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (logReturns.length - 1);
    const stdDev = Math.sqrt(variance);

    const periodsPerYear = { '1min': 525600, '5min': 105120, '15min': 35040, '1h': 8760, '4h': 2190, '1day': 365 }[interval] || 105120;
    const annualized = stdDev * Math.sqrt(periodsPerYear);

    const fearIndex = Math.min(100, annualized * 100 * 5);
    const regime = annualized < 0.2 ? 'LOW' : annualized < 0.4 ? 'NORMAL' : annualized < 0.7 ? 'ELEVATED' : 'EXTREME';

    res.status(200).json({
      symbol,
      interval,
      realizedVol: stdDev,
      realizedVolAnnualized: annualized,
      fearIndex,
      regime,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Volatility Pulse error:', error);
    res.status(500).json({ error: error.message });
  }
}
