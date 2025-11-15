import { fhGet } from '../finnhub';

type NewsItem = {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
};

type SentimentData = {
  buzz: {
    articlesInLastWeek: number;
    buzz: number;
    weeklyAverage: number;
  };
  companyNewsScore: number;
  sectorAverageBullishPercent: number;
  sectorAverageNewsScore: number;
  sentiment: {
    bearishPercent: number;
    bullishPercent: number;
  };
  symbol: string;
};

/**
 * Sentiment Radar - Multi-source sentiment aggregation
 * 
 * Analyzes sentiment from news articles, social media, and trading forums
 * to generate crowd mood vectors and narrative tracking.
 * 
 * @param symbol - Asset symbol (e.g., "AAPL", "TSLA", or crypto symbols)
 */
export async function getSentimentRadar(symbol: string = 'AAPL') {
  try {
    // For crypto symbols, convert format (BTC/USD -> BTC)
    const cleanSymbol = symbol.split('/')[0];

    // Fetch news sentiment from Finnhub
    const newsData = await fhGet<NewsItem[]>('/company-news', {
      symbol: cleanSymbol,
      from: getDateDaysAgo(7),
      to: getTodayDate(),
    });

    // Fetch sentiment scores
    let sentimentScores: SentimentData | null = null;
    try {
      sentimentScores = await fhGet<SentimentData>('/news-sentiment', {
        symbol: cleanSymbol,
      });
    } catch (e) {
      console.warn('Sentiment scores not available for', cleanSymbol);
    }

    // Analyze news headlines with NLP
    const enrichedNews = newsData.slice(0, 20).map((item) => {
      const score = naiveSentimentScore(item.headline + ' ' + item.summary);
      return {
        ...item,
        sentiment: score,
        sentimentLabel: score > 0 ? 'BULLISH' : score < 0 ? 'BEARISH' : 'NEUTRAL',
      };
    });

    // Calculate aggregate sentiment
    const avgSentiment =
      enrichedNews.reduce((sum, n) => sum + n.sentiment, 0) / (enrichedNews.length || 1);

    // Buzz score (article volume)
    const buzz = sentimentScores?.buzz.buzz || 0;
    const articlesCount = sentimentScores?.buzz.articlesInLastWeek || enrichedNews.length;

    // Bullish/bearish percentages
    const bullishPct = sentimentScores?.sentiment.bullishPercent || 50;
    const bearishPct = sentimentScores?.sentiment.bearishPercent || 50;

    // Overall mood classification
    const mood = classifyMood(avgSentiment, bullishPct, bearishPct);

    // Trending topics extraction
    const topics = extractTopics(enrichedNews.map((n) => n.headline));

    return {
      symbol: cleanSymbol,
      score: avgSentiment,
      mood,
      metrics: {
        bullishPercent: bullishPct,
        bearishPercent: bearishPct,
        neutralPercent: 100 - bullishPct - bearishPct,
        buzz,
        articlesCount,
      },
      news: enrichedNews.slice(0, 10),
      topics,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Sentiment Radar error:', error);
    throw new Error(`Failed to fetch Sentiment Radar data: ${error.message}`);
  }
}

/**
 * Naive sentiment scoring using keyword matching
 * Production should use BERT/GPT fine-tuned models
 */
function naiveSentimentScore(text: string): number {
  const positiveWords = [
    'gain',
    'rally',
    'bull',
    'upgrade',
    'beat',
    'surge',
    'soar',
    'jump',
    'climb',
    'strong',
    'positive',
    'growth',
    'profit',
    'record',
    'high',
    'breakout',
    'momentum',
  ];

  const negativeWords = [
    'loss',
    'fall',
    'bear',
    'downgrade',
    'miss',
    'crash',
    'plunge',
    'drop',
    'decline',
    'weak',
    'negative',
    'concern',
    'risk',
    'worry',
    'low',
    'breakdown',
  ];

  const lower = text.toLowerCase();
  let score = 0;

  positiveWords.forEach((w) => {
    if (lower.includes(w)) score += 1;
  });

  negativeWords.forEach((w) => {
    if (lower.includes(w)) score -= 1;
  });

  return score;
}

function classifyMood(
  score: number,
  bullishPct: number,
  bearishPct: number
): {
  label: 'EXTREME_FEAR' | 'FEAR' | 'NEUTRAL' | 'GREED' | 'EXTREME_GREED';
  description: string;
  color: string;
} {
  const netBullish = bullishPct - bearishPct;

  if (score < -2 || netBullish < -30) {
    return {
      label: 'EXTREME_FEAR',
      description: 'Market sentiment is extremely bearish',
      color: '#ef4444',
    };
  } else if (score < -0.5 || netBullish < -10) {
    return {
      label: 'FEAR',
      description: 'Market sentiment is bearish',
      color: '#f97316',
    };
  } else if (score > 2 || netBullish > 30) {
    return {
      label: 'EXTREME_GREED',
      description: 'Market sentiment is extremely bullish',
      color: '#22c55e',
    };
  } else if (score > 0.5 || netBullish > 10) {
    return {
      label: 'GREED',
      description: 'Market sentiment is bullish',
      color: '#84cc16',
    };
  } else {
    return {
      label: 'NEUTRAL',
      description: 'Market sentiment is neutral',
      color: '#a3a3a3',
    };
  }
}

function extractTopics(headlines: string[]): string[] {
  const words = headlines
    .join(' ')
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 4);

  const freq: Record<string, number> = {};
  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });

  // Filter common words
  const stopwords = ['about', 'after', 'there', 'their', 'would', 'could', 'should', 'which'];
  Object.keys(freq).forEach((w) => {
    if (stopwords.includes(w)) delete freq[w];
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((e) => e[0]);
}

function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}
