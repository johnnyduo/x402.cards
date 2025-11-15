# Vercel Deployment Setup

## Quick Deploy

1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository: `johnnyduo/x402-streamflow`
   - Vercel will auto-detect Vite configuration

2. **Add Environment Variables**
   
   In Vercel dashboard → Settings → Environment Variables, add:

   ```
   TWELVEDATA_API_KEY=87f2fa4ff46945ff84fef04b9edaee07
   FINNHUB_API_KEY=d4caq6hr01qudf6henrgd4caq6hr01qudf6hens0
   VITE_CHAIN_ID=1076
   VITE_RPC_URL=https://json-rpc.evm.testnet.iota.cafe
   VITE_STREAMING_PAYMENTS_ADDRESS=0x37E141fF46c431D8B8C781f0f1d9b6E1A88d93b9
   VITE_AGENT_REGISTRY_ADDRESS=0xA3630777E25021B1DA2b5BA0a5F5Eed0bB5f0c0d
   VITE_USDC_ADDRESS=0x1ce14fD9dd6678fC3d192f02207d6ff999B04037
   VITE_PLATFORM_FEE_BPS=100
   VITE_FEE_RECIPIENT=0x5ebaddf71482d40044391923be1fc42938129988
   VITE_REOWN_PROJECT_ID=2aaa6469698af00874e7e688d69eab25
   ```

3. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your site will be live at `https://your-project.vercel.app`

## API Routes (Serverless Functions)

All configured in `/api-vercel/`:

- ✅ `/api/agents/signal-forge` - Trading signals with SMA, RSI analysis
- ✅ `/api/agents/volatility-pulse` - Volatility metrics and fear index  
- ✅ `/api/agents/arb-navigator` - Arbitrage opportunities
- ✅ `/api/agents/sentiment-radar` - News sentiment analysis
- ✅ `/api/agents/risk-sentinel` - Portfolio risk monitoring

## Local Development

```bash
# Install dependencies
yarn install

# Run Vite dev server (port 8080/8081)
yarn dev

# Run API server (port 3001)
cd api && yarn dev
```

## CLI Deployment (Optional)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Testing After Deployment

1. Visit your Vercel URL
2. Navigate to `/developers` page
3. Scroll to "Live Agent Data" section
4. Verify all 4 agents are showing real-time data

## Troubleshooting

- **API not working**: Check environment variables are set in Vercel dashboard
- **Build fails**: Ensure all dependencies in `package.json` are correct
- **CORS errors**: All API functions have CORS headers configured

The serverless functions will automatically scale and work on Vercel's edge network! 🚀
