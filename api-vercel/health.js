export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const TWELVEDATA_API_KEY = process.env.TWELVEDATA_API_KEY;
    const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

    const twelveDataStatus = TWELVEDATA_API_KEY ? 'Connected' : 'Not Configured';
    const finnhubStatus = FINNHUB_API_KEY ? 'Connected' : 'Not Configured';

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      twelveData: twelveDataStatus,
      finnhub: finnhubStatus,
      endpoints: [
        '/api/agents/signal-forge',
        '/api/agents/volatility-pulse',
        '/api/agents/arb-navigator',
        '/api/agents/sentiment-radar',
        '/api/agents/risk-sentinel',
      ],
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
}
