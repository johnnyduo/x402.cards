import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// API Keys
const TWELVEDATA_API_KEY = process.env.TWELVEDATA_API_KEY || '87f2fa4ff46945ff84fef04b9edaee07';
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'd4caq6hr01qudf6henrgd4caq6hr01qudf6hens0';

// ==================== TWELVE DATA CLIENT ====================
async function tdGet(path, params) {
  const url = new URL(path, 'https://api.twelvedata.com');
  Object.entries({ ...params, apikey: TWELVEDATA_API_KEY }).forEach(([k, v]) =>
    url.searchParams.append(k, String(v))
  );

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TwelveData error: ${res.status}`);
  const json = await res.json();
  if (json.status === 'error') {
    throw new Error(`TwelveData API error: ${json.message}`);
  }
  return json;
}

// ==================== FINNHUB CLIENT ====================
async function fhGet(endpoint, params = {}) {
  const url = new URL(endpoint, 'https://finnhub.io/api/v1');
  Object.entries({ ...params, token: FINNHUB_API_KEY }).forEach(([k, v]) =>
    url.searchParams.append(k, String(v))
  );

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Finnhub error: ${res.status}`);
  const json = await res.json();
  if (json.error) {
    throw new Error(`Finnhub API error: ${json.error}`);
  }
  return json;
}

// ==================== SIGNAL FORGE ====================
app.get('/api/agents/signal-forge', async (req, res) => {
  try {
    const symbol = req.query.symbol || 'BTC/USD';
    const interval = req.query.interval || '5min';
    const outputsize = parseInt(req.query.outputsize) || 500;

    const data = await tdGet('/time_series', {
      symbol,
      interval,
      outputsize,
      order: 'desc',
    });

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

    res.json({
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
});

// ==================== VOLATILITY PULSE ====================
app.get('/api/agents/volatility-pulse', async (req, res) => {
  try {
    const symbol = req.query.symbol || 'BTC/USD';
    const interval = req.query.interval || '5min';

    const data = await tdGet('/time_series', {
      symbol,
      interval,
      outputsize: 300,
      order: 'desc',
    });

    const candles = data.values;
    const closes = candles.map(c => parseFloat(c.close));
    const highs = candles.map(c => parseFloat(c.high));
    const lows = candles.map(c => parseFloat(c.low));

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

    res.json({
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
});

// ==================== ARB NAVIGATOR ====================
app.get('/api/agents/arb-navigator', async (req, res) => {
  try {
    const symbols = (req.query.symbols || 'BTC/USD,ETH/USD,BNB/USD').split(',');
    const symbolStr = symbols.join(',');

    const data = await tdGet('/quote', { symbol: symbolStr });
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

    res.json({
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
});

// ==================== SENTIMENT RADAR ====================
app.get('/api/agents/sentiment-radar', async (req, res) => {
  try {
    const symbol = req.query.symbol || 'AAPL';
    const cleanSymbol = symbol.split('/')[0];

    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const to = new Date().toISOString().split('T')[0];

    const newsData = await fhGet('/company-news', {
      symbol: cleanSymbol,
      from,
      to,
    });

    const enrichedNews = newsData.slice(0, 20).map(item => {
      const score = naiveSentimentScore(item.headline + ' ' + item.summary);
      return {
        headline: item.headline,
        summary: item.summary,
        url: item.url,
        datetime: item.datetime,
        sentiment: score,
        sentimentLabel: score > 0 ? 'BULLISH' : score < 0 ? 'BEARISH' : 'NEUTRAL',
      };
    });

    const avgSentiment = enrichedNews.reduce((sum, n) => sum + n.sentiment, 0) / (enrichedNews.length || 1);
    const bullishCount = enrichedNews.filter(n => n.sentiment > 0).length;
    const bearishCount = enrichedNews.filter(n => n.sentiment < 0).length;
    const bullishPct = (bullishCount / enrichedNews.length) * 100;
    const bearishPct = (bearishCount / enrichedNews.length) * 100;

    const mood = avgSentiment < -2 ? 'EXTREME_FEAR' : avgSentiment < -0.5 ? 'FEAR' : avgSentiment > 2 ? 'EXTREME_GREED' : avgSentiment > 0.5 ? 'GREED' : 'NEUTRAL';

    res.json({
      symbol: cleanSymbol,
      score: avgSentiment,
      mood,
      metrics: {
        bullishPercent: bullishPct,
        bearishPercent: bearishPct,
        neutralPercent: 100 - bullishPct - bearishPct,
        articlesCount: enrichedNews.length,
      },
      news: enrichedNews.slice(0, 10),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Sentiment Radar error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== RISK SENTINEL ====================
app.get('/api/agents/risk-sentinel', async (req, res) => {
  try {
    const address = req.query.address;
    
    // Mock data - in production, fetch from your DB/blockchain
    const positions = [
      { symbol: 'BTC/USD', quantity: 0.5, entryPrice: 40000 },
      { symbol: 'ETH/USD', quantity: 5, entryPrice: 2500 },
    ];

    const symbols = positions.map(p => p.symbol).join(',');
    const quotes = await tdGet('/price', { symbol: symbols });

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

    res.json({
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
});

// ==================== HELPER FUNCTIONS ====================
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

function naiveSentimentScore(text) {
  const positiveWords = ['gain', 'rally', 'bull', 'upgrade', 'beat', 'surge', 'soar', 'jump', 'climb', 'strong', 'positive', 'growth', 'profit'];
  const negativeWords = ['loss', 'fall', 'bear', 'downgrade', 'miss', 'crash', 'plunge', 'drop', 'decline', 'weak', 'negative', 'concern', 'risk'];
  
  const lower = text.toLowerCase();
  let score = 0;
  
  positiveWords.forEach(w => { if (lower.includes(w)) score += 1; });
  negativeWords.forEach(w => { if (lower.includes(w)) score -= 1; });
  
  return score;
}

app.listen(PORT, () => {
  console.log(`✅ x402 API Server running on http://localhost:${PORT}`);
  console.log(`📊 Twelve Data API: ${TWELVEDATA_API_KEY ? 'Connected' : 'Missing'}`);
  console.log(`📰 Finnhub API: ${FINNHUB_API_KEY ? 'Connected' : 'Missing'}`);
});
