Below is the **FULL PROJECT SPECIFICATION + README** for **x402.Cards** — including the new requirement:

> **Add-on card opens a popup modal where users can enable “AI Crawlers / Plugin Receivers” that stream funding or data when plugged into external websites.**
> (This creates a marketplace of plugin services.)

This is now a **complete product document** scoped for a real hackathon or production build.

Everything is covered:

* Project mission
* Architecture
* UI/UX structure
* Components
* Agent system
* Add-on plugin modal
* Data flows
* Tech stack
* API layout
* Readme
* File structure
* Behavior rules

It’s clean, complete, and dev-ready.

---

# 🌐 **x402.Cards — Full Project Specification & README**

### **Web3 Autonomous Streaming Intelligence Dashboard**

**Built on IOTA EVM · Powered by x402 Streaming Payments**

---

# 1. 📘 **Project Summary**

**x402.Cards** is a **real-time autonomous data streaming platform** where users activate **flip-card Data Agents** and pay **per second** using x402 payment headers on IOTA EVM.

Users receive continuous flows of:

* **Trading signals**
* **Volatility alerts**
* **Arbitrage paths**
* **Market sentiment**
* **Risk indices**

Each agent is a **flip card** that can be toggled ON/OFF.

In the center of the screen sits a **Central Hub** which:

* Aggregates all active agents
* Visualizes flowing incoming data like **water lines**
* Contains a **master “Open All Streams” button**

Additionally, the **Add-on card** opens a **Plugin Modal** where users activate:

* AI Crawler Plugin (for funding external web content)
* AI Content Monitor
* Social Stream Scraper
* On-Chain Anomaly Scanner
* Custom Plugin (user-hosted crawler)

This turns x402.Cards into a **plugin ecosystem**.

---

# 2. 🎨 **Design System (Color, Type, Style)**

### **Color Palette (IOTA Inspired, #RRGGBB)**

| Name                 | Color     |
| -------------------- | --------- |
| Primary Blue         | `#2978FF` |
| Teal Accent          | `#19D3C5` |
| Dark Navy Background | `#020617` |
| Deep Blue Gradient   | `#0B1C3F` |
| Light Text           | `#E2E8F0` |
| Muted Text           | `#94A3B8` |
| Error / Stop         | `#FF4567` |

### **Typography (Avoid AI-template look)**

* **Söhne / Söhne Breit** → Titles, card faces
* **IBM Plex Sans** → Body, UI labels

Professional, Web3-native, premium.

---

# 3. 🖥 **Main App Layout**

The application launches into a **“Laptop Screen Viewport”**:

```
 ------------------------------
|     6-card interactive grid   |
|    (2x3 layout of agents)     |
|    Central hub overlapping    |
 ------------------------------
```

A polished futuristic container with:

* Glassmorphism
* Gradient border glows
* Particle background animation

---

# 4. 💠 **6 Flip Cards (Agents)**

Grid layout = **2 rows × 3 columns**.

Five agents + one add-on card:

| Position | Card             |
| -------- | ---------------- |
| 1        | Signal Forge     |
| 2        | Volatility Pulse |
| 3        | Arb Navigator    |
| 4        | Sentiment Radar  |
| 5        | Risk Sentinel    |
| 6        | Add-on Streams   |

Each card:

* Has a **flip animation**
* Shows **front side** and **preview back side**
* Has an **individual toggle switch**
* Sends **data flow animation** to central hub when ON

---

## 4.1 Flip Card: Front (Default)

* Icon
* Agent Name
* Category Tag
* One-line description
* Pricing (`0.0002 USDC/sec`)
* Status pill (`OFF`/`ON`)
* Individual toggle
* Light glassmorphic glow border

---

## 4.2 Flip Card: Back (Preview)

* Mini chart preview
* 3–4 bullet points of data output
* Last event preview
* Buttons:

  * **Start Stream**
  * **View Full Dashboard**

---

# 5. 🌌 **Central Hub (Dashboard Core)**

The hub sits **in the center**, overlapping the grid.

### Features:

* Circular or hexagonal glowing form
* Glassmorphism with depth
* Aggregated metrics:

  * Active Agents
  * Total Streams Cost (USDC/sec)
  * Sentiment Summary
  * Risk Summary

### Master Button (Huge CTA)

> **“Open All Streams”**
> Toggles ALL cards ON/OFF.

### Data Flow Visualization

Each card connects to the hub with a **glowing curved stream line**:

* Idle: dim, pulsing
* Active: blue→teal gradient, particles flowing
* Perfectly resembles your **water-flow animation** example

---

# 6. ⚙️ **Add-On Card (Plugin Modal)**

Clicking the Add-On card opens a **Plugin Modal**:

### Modal Contents:

**Header:**

> “Add-On Plugin Services (Extend x402.Cards to your Apps)”

**Plugin Options (selectable cards):**

1️⃣ **AI Crawler Plugin**

* Widget for external websites
* Crawls user-selected content
* Receives **stream funding** via x402
* Generates real-time insight streams

2️⃣ **AI Content Monitor**

* Watches blogs, docs, web pages
* Streams keywords, events, updates

3️⃣ **On-Chain Anomaly Scanner**

* Detects wallet activity patterns
* Streams alerts

4️⃣ **Social Stream Scraper**

* Monitors Twitter/X, Reddit, Telegram
* Streams aggregated sentiment

5️⃣ **Custom Plugin Receiver** *(for developers)*

* User inputs:

  * script URL
  * webhook target
  * data schema
* Platform streams data + micropayments

### Buttons:

* **Install Plugin**
* **Generate Script Snippet**
* **Copy to Clipboard**

This modal shows x402.Cards’ **extensibility**.

---

# 7. 🔧 **Tech Stack**

### **Frontend**

* **React + Vite**
* TypeScript
* TailwindCSS or CSS Modules
* Framer Motion (flip animation + transitions)
* SVG/CSS Animated Streams (flow lines)

### **Backend**

* Node.js
* Express or Fastify
* IOTA EVM RPC
* x402 Facilitator endpoint

### **Smart Contracts**

* IOTA EVM
* ERC-20 streaming tokens
* x402-compatible payment function
* Subscription stream supervisor

---

# 8. 🧱 **React Component Architecture**

```
src/
  App.tsx
  main.tsx
  context/
    StreamsContext.tsx
  components/
    TopNav/
    LaptopViewport/
      LaptopViewport.tsx
      AgentCard.tsx
      FlipCard.tsx
      CentralHub.tsx
      StreamLine.tsx
    AddonModal/
      AddonModal.tsx
    Charts/
      MiniChart.tsx
      LiveChart.tsx
  styles/
    global.css
    animations.css
```

### Core components:

* **AgentCard** → handles flip interaction + ON/OFF switch
* **StreamLine** → animated water lines
* **CentralHub** → master button + aggregated stats
* **AddonModal** → plugin marketplace UI

---

# 9. 🔥 **Application Behavior Logic**

### Rules:

* Master button ON = All 6 agents ON
* Master button OFF = All 6 agents OFF
* Individual switch:

  * Toggles only that agent
  * Hub updates aggregated stats

### Flip behavior:

* Hover/click flips card
* Back shows preview data

### Streams:

* When ON:

  * Card glows
  * StreamLine integrates gradient animation
  * Data piped into hub

---

# 10. 📄 **README.md (Production-Ready)**

Below is the **full README** you can paste into GitHub:

---

# **x402.Cards**

## *Autonomous Streaming Intelligence Dashboard · Powered by IOTA EVM & x402*

### 🚀 Overview

x402.Cards is a real-time DeFi intelligence platform where users activate **flip-card agents** that stream live data and pay **per second** using x402 streaming payments on IOTA EVM.

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
* TailwindCSS or CSS Modules
* Framer Motion (3D flip animations)
* IOTA EVM RPC
* x402 facilitator backend

---

## 📁 Project Structure

```
src/
  App.tsx
  context/
    StreamsContext.tsx
  components/
    LaptopViewport/
    AgentCard/
    CentralHub/
    StreamLine/
    AddonModal/
```

---

## ▶️ Running the App

```
npm install
npm run dev
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

---

# ✔️ Done.

You now have a **complete project specification**, **plugin modal design**, **readme**, **UI guidelines**, **architecture**, **component tree**, and **product logic**.