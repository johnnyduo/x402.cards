# Vercel Deployment Setup

## Environment Variables

Add these to your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following:

```
TWELVEDATA_API_KEY=87f2fa4ff46945ff84fef04b9edaee07
FINNHUB_API_KEY=d4caq6hr01qudf6henrgd4caq6hr01qudf6hens0
```

## API Routes

The following serverless functions are configured:

- `/api/agents/signal-forge` - Trading signals with SMA, RSI analysis
- `/api/agents/volatility-pulse` - Volatility metrics and fear index
- `/api/agents/arb-navigator` - Arbitrage opportunities
- `/api/agents/sentiment-radar` - News sentiment analysis
- `/api/agents/risk-sentinel` - Portfolio risk monitoring

## Deployment

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

The API routes will automatically work on Vercel with the serverless functions in `/api-vercel/`.
