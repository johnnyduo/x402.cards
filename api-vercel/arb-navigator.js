export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const TWELVEDATA_API_KEY = process.env.TWELVEDATA_API_KEY;

  try {
    const { symbols = 'BTC/USD,ETH/USD,BNB/USD' } = req.query;
    const symbolArr = symbols.split(',');

    const url = new URL('/quote', 'https://api.twelvedata.com');
    url.searchParams.append('symbol', symbols);
    url.searchParams.append('apikey', TWELVEDATA_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message);
    }

    const quotes = Object.values(data);

    const opportunities = [];
    for (let i = 0; i < quotes.length; i++) {
      for (let j = i + 1; j < quotes.length; j++) {
        const price1 = parseFloat(quotes[i].price);
        const price2 = parseFloat(quotes[j].price);
        const spreadAbs = Math.abs(price1 - price2);
        const spreadPct = (spreadAbs / Math.min(price1, price2)) * 100;

        if (spreadPct > 0.1) {
          opportunities.push({
            pair: [quotes[i].symbol, quotes[j].symbol],
            prices: [price1, price2],
            spreadPct,
            profitability: spreadPct < 0.5 ? 'LOW' : spreadPct < 1.5 ? 'MEDIUM' : spreadPct < 3 ? 'HIGH' : 'EXTREME',
          });
        }
      }
    }

    opportunities.sort((a, b) => b.spreadPct - a.spreadPct);

    res.status(200).json({
      quotes,
      opportunities: opportunities.slice(0, 10),
      summary: {
        totalOpportunities: opportunities.length,
        topSpread: opportunities[0]?.spreadPct || 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Arb Navigator error:', error);
    res.status(500).json({ error: error.message });
  }
}
