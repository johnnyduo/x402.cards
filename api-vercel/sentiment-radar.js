export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

  try {
    const { symbol = 'AAPL' } = req.query;
    const cleanSymbol = symbol.split('/')[0];

    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const to = new Date().toISOString().split('T')[0];

    const url = new URL('/company-news', 'https://finnhub.io/api/v1');
    url.searchParams.append('symbol', cleanSymbol);
    url.searchParams.append('from', from);
    url.searchParams.append('to', to);
    url.searchParams.append('token', FINNHUB_API_KEY);

    const response = await fetch(url.toString());
    const newsData = await response.json();

    if (newsData.error) {
      throw new Error(newsData.error);
    }

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

    res.status(200).json({
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
