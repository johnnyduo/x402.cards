#!/usr/bin/env node

import fs from 'fs';

const file = fs.readFileSync('server.js', 'utf8');

// Add cache before each res.json(response);
const updatedFile = file
  // Signal Forge
  .replace(
    /(\s+)(res\.json\(response\);)(\s+} catch \(error\) \{\s+console\.error\('Signal Forge error:', error\);)/,
    '$1cache[cacheKey] = { data: response, ts: Date.now() };$1$2$3'
  )
  // Volatility Pulse
  .replace(
    /(\s+)(res\.json\(response\);)(\s+} catch \(error\) \{\s+console\.error\('Volatility Pulse error:', error\);)/,
    '$1const vpcacheKey = `vp:${symbol}:${interval}`;$1cache[vpcacheKey] = { data: response, ts: Date.now() };$1$2$3'
  )
  // Arb Navigator
  .replace(
    /(\s+)(res\.json\(response\);)(\s+} catch \(error\) \{\s+console\.error\('Arb Navigator error:', error\);)/,
    '$1cache["arb"] = { data: response, ts: Date.now() };$1$2$3'
  )
  // Sentiment Radar
  .replace(
    /(\s+)(res\.json\(response\);)(\s+} catch \(error\) \{\s+console\.error\('Sentiment Radar error:', error\);)/,
    '$1const srcacheKey = `sr:${symbol}`;$1cache[srcacheKey] = { data: response, ts: Date.now() };$1$2$3'
  )
  // Risk Sentinel
  .replace(
    /(\s+)(res\.json\(response\);)(\s+} catch \(error\) \{\s+console\.error\('Risk Sentinel error:', error\);)/,
    '$1cache["risk"] = { data: response, ts: Date.now() };$1$2$3'
  )
  // Fix Finnhub news call
  .replace(
    /const newsData = await fhGet\('\/news', \{ category: 'crypto', symbol \}\);/,
    `const newsData = await fhGet('/news', { category: 'crypto' });`
  )
  // Add cache check to volatility pulse
  .replace(
    /(app\.get\('\/api\/agents\/volatility-pulse', async \(req, res\) => \{\s+try \{\s+const symbol = req\.query\.symbol \|\| 'BTC\/USD';\s+const interval = req\.query\.interval \|\| '5min';)/,
    `$1\n    const vpcacheKey = \`vp:\${symbol}:\${interval}\`;\n    if (cache[vpcacheKey] && (Date.now() - cache[vpcacheKey].ts < CACHE_TTL)) {\n      return res.json(cache[vpcacheKey].data);\n    }`
  )
  // Add cache check to arb navigator
  .replace(
    /(app\.get\('\/api\/agents\/arb-navigator', async \(req, res\) => \{\s+try \{)/,
    `$1\n    if (cache["arb"] && (Date.now() - cache["arb"].ts < CACHE_TTL)) {\n      return res.json(cache["arb"].data);\n    }`
  )
  // Add cache check to sentiment radar
  .replace(
    /(app\.get\('\/api\/agents\/sentiment-radar', async \(req, res\) => \{\s+try \{\s+const \{ symbol = 'BTC' \} = req\.query;)/,
    `$1\n    const srcacheKey = \`sr:\${symbol}\`;\n    if (cache[srcacheKey] && (Date.now() - cache[srcacheKey].ts < CACHE_TTL)) {\n      return res.json(cache[srcacheKey].data);\n    }`
  )
  // Add cache check to risk sentinel
  .replace(
    /(app\.get\('\/api\/agents\/risk-sentinel', async \(req, res\) => \{\s+try \{)/,
    `$1\n    if (cache["risk"] && (Date.now() - cache["risk"].ts < CACHE_TTL)) {\n      return res.json(cache["risk"].data);\n    }`
  );

fs.writeFileSync('server.js', updatedFile);
console.log('✅ Server.js updated with caching');
