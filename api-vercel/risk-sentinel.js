export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const TWELVEDATA_API_KEY = process.env.TWELVEDATA_API_KEY;

  try {
    const { address } = req.query;
    
    // Mock data - in production, fetch from your DB/blockchain
    const positions = [
      { symbol: 'BTC/USD', quantity: 0.5, entryPrice: 40000 },
      { symbol: 'ETH/USD', quantity: 5, entryPrice: 2500 },
    ];

    const symbols = positions.map(p => p.symbol).join(',');
    
    const url = new URL('/price', 'https://api.twelvedata.com');
    url.searchParams.append('symbol', symbols);
    url.searchParams.append('apikey', TWELVEDATA_API_KEY);

    const response = await fetch(url.toString());
    const quotes = await response.json();

    if (quotes.status === 'error') {
      throw new Error(quotes.message);
    }

    let totalPnl = 0;
    let exposure = 0;

    const withMetrics = positions.map(p => {
      const price = parseFloat(quotes[p.symbol].price);
      const valueNow = price * p.quantity;
      const valueEntry = p.entryPrice * p.quantity;
      const pnl = valueNow - valueEntry;

      totalPnl += pnl;
      exposure += Math.abs(valueNow);

      return { ...p, price, valueNow, pnl };
    });

    const healthScore = Math.max(0, Math.min(100, 50 + (totalPnl / exposure) * 100));

    res.status(200).json({
      address,
      positions: withMetrics,
      totalPnl,
      exposure,
      healthScore,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Risk Sentinel error:', error);
    res.status(500).json({ error: error.message });
  }
}
