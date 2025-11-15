# **x402.Cards**

## *Autonomous Streaming Intelligence Dashboard · Powered by IOTA EVM & x402*

### 🚀 Overview

x402.Cards is a real-time DeFi intelligence platform where users activate **flip-card agents** that stream live data and pay **per second** using x402 streaming payments on IOTA EVM.

---

## 📦 Deployment on Vercel

### Quick Deploy

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable:
     - `VITE_REOWN_PROJECT_ID` = `2aaa6469698af00874e7e688d69eab25`
   - Click **Deploy**

3. **Environment Variables** (Required)
   ```
   VITE_REOWN_PROJECT_ID=2aaa6469698af00874e7e688d69eab25
   ```

### Local Development

```bash
# Install dependencies
yarn install

# Copy environment file
cp .env.example .env

# Start dev server
yarn dev
```

---

Agents provide:

* Trading signals
* Volatility alerts
* Arbitrage routes
* Sentiment scores
* Risk indices

All flows are visualized with **animated water-like streams** feeding into a **central dashboard hub**.

---

## 🧩 Features

### ✔ 6 Flip-Card Agents

5 core agents + 1 add-on card
Each card:

* Flips to show preview
* Has toggle switch for streaming
* Sends animated data stream to central hub

### ✔ Central Hub

* Master control for all 6 agents
* Aggregated metrics
* Animated gradient streams flowing from each card

### ✔ Add-On Plugin Modal

Users can enable optional services:

* AI Crawler Plugin
* AI Content Monitor
* On-Chain Anomaly Scanner
* Social Stream Scraper
* Custom Plugin Receiver

Each plugin generates its own x402-powered stream integration.

---

## 🔧 Tech Stack

* **React + Vite**
* TypeScript
* TailwindCSS
* Framer Motion (3D flip animations)
* shadcn-ui components
* IOTA EVM RPC
* x402 facilitator backend

---

## 📁 Project Structure

```
src/
  App.tsx
  main.tsx
  components/
    AgentCard.tsx
    CentralHub.tsx
    StreamFlow.tsx
    AppHeader.tsx
    Navigation.tsx
  pages/
    Streams.tsx
    Active.tsx
    Developers.tsx
```

---

## ▶️ Running the App

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

---

## 🧠 Architecture Summary

* x402 validates payment headers
* Agents publish real-time signals
* User toggles activate microstreams
* Water-flow visualization connects all agents to hub
* Add-on plugins integrate external crawlers

---

## 📜 License

MIT
