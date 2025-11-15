import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Copy, Key, Code, Webhook, Loader2, TrendingUp, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAgentData } from "@/hooks/useAgentData";

const Developers = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Code example copied successfully",
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-32 px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-display font-bold tracking-tight mb-3">
              Developers
            </h1>
            <p className="text-muted-foreground font-body">
              Integrate x402.Cards data streams into your applications
            </p>
          </div>

          <div className="space-y-6">
            {/* API Key Section */}
            <div className="glass-strong p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-display font-semibold">API Key</h2>
              </div>
              <div className="glass p-4 rounded-xl font-mono text-sm mb-4 flex items-center justify-between">
                <span className="text-muted-foreground">x402_sk_1234567890abcdef...</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard("x402_sk_1234567890abcdef")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground font-body">
                Keep your API key secure. Do not expose it in client-side code.
              </p>
            </div>

            {/* Code Examples */}
            <div className="glass-strong p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Code className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-display font-semibold">Code Examples</h2>
              </div>

              <div className="space-y-4">
                {/* cURL Example */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="font-display">cURL</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard("curl -X POST https://api.x402.cards/v1/streams/start...")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="glass p-4 rounded-xl overflow-x-auto">
                    <code className="text-xs font-mono text-muted-foreground">
{`curl -X POST https://api.x402.cards/v1/streams/start \\
  -H "Authorization: Bearer x402_sk_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent": "signal-forge",
    "duration": 60
  }'`}
                    </code>
                  </pre>
                </div>

                {/* Node.js Example */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="font-display">Node.js</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard("const x402 = require('@x402/sdk')...")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="glass p-4 rounded-xl overflow-x-auto">
                    <code className="text-xs font-mono text-muted-foreground">
{`const x402 = require('@x402/sdk');

const client = new x402.Client({
  apiKey: 'x402_sk_YOUR_KEY'
});

const stream = await client.streams.start({
  agent: 'signal-forge',
  duration: 60
});

stream.on('data', (data) => {
  console.log('Received:', data);
});`}
                    </code>
                  </pre>
                </div>

                {/* Python Example */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="font-display">Python</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard("import x402...")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="glass p-4 rounded-xl overflow-x-auto">
                    <code className="text-xs font-mono text-muted-foreground">
{`import x402

client = x402.Client(
    api_key='x402_sk_YOUR_KEY'
)

stream = client.streams.start(
    agent='signal-forge',
    duration=60
)

for data in stream:
    print(f'Received: {data}')`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Webhook Tester */}
            <div className="glass-strong p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Webhook className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-display font-semibold">Webhook Tester</h2>
              </div>
              <p className="text-sm text-muted-foreground font-body mb-4">
                Test webhook endpoints for real-time stream data delivery
              </p>
              <Button
                variant="outline"
                className="font-display tracking-wide"
              >
                Configure Webhooks
              </Button>
            </div>

            {/* Live Agent Data */}
            <LiveAgentData />

            {/* Coming Soon */}
            <div className="glass p-6 rounded-2xl border-2 border-secondary/20">
              <h3 className="text-lg font-display font-semibold mb-2 gradient-text">
                Coming Soon
              </h3>
              <ul className="space-y-2">
                <li className="text-sm font-body text-muted-foreground flex items-start">
                  <span className="text-secondary mr-2">→</span>
                  Advanced analytics modules
                </li>
                <li className="text-sm font-body text-muted-foreground flex items-start">
                  <span className="text-secondary mr-2">→</span>
                  Partner data card marketplace
                </li>
                <li className="text-sm font-body text-muted-foreground flex items-start">
                  <span className="text-secondary mr-2">→</span>
                  Custom agent creation tools
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Live Agent Data Component
function LiveAgentData() {
  const { data: signalData, loading: signalLoading } = useAgentData('signal-forge', { symbol: 'BTC/USD', interval: '5min' });
  const { data: volData, loading: volLoading } = useAgentData('volatility-pulse', { symbol: 'BTC/USD' });
  const { data: arbData, loading: arbLoading } = useAgentData('arb-navigator', { symbols: 'BTC/USD,ETH/USD,BNB/USD' });
  const { data: sentimentData, loading: sentimentLoading } = useAgentData('sentiment-radar', { symbol: 'BTC' });

  return (
    <div className="glass-strong p-6 rounded-2xl">
      <h2 className="text-xl font-display font-semibold mb-6">Live Agent Data</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Signal Forge */}
        <Card className="glass p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display font-semibold">Signal Forge</h3>
              {signalData?.symbol && (
                <span className="text-xs font-mono text-secondary font-bold">{signalData.symbol}</span>
              )}
            </div>
            <Activity className="w-4 h-4 text-secondary" />
          </div>

          {signalLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 text-secondary animate-spin" />
            </div>
          ) : signalData ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="font-semibold">${signalData.currentPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">RSI</span>
                <span className="font-semibold">{signalData.indicators?.rsi14?.toFixed(1)}</span>
              </div>
              <div className="bg-black/20 rounded p-2 mt-2">
                <Badge variant="outline" className={
                  signalData.signal?.action === 'BUY' ? 'border-green-500 text-green-500' :
                  signalData.signal?.action === 'SELL' ? 'border-red-500 text-red-500' :
                  'border-white/30'
                }>
                  {signalData.signal?.action}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{signalData.signal?.reason}</p>
              </div>
            </div>
          ) : null}
        </Card>

        {/* Volatility Pulse */}
        <Card className="glass p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold">Volatility Pulse</h3>
            <TrendingUp className="w-4 h-4 text-secondary" />
          </div>

          {volLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 text-secondary animate-spin" />
            </div>
          ) : volData ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Regime</span>
                <Badge variant="outline" className={
                  volData.regime === 'LOW' ? 'border-green-500 text-green-500' :
                  volData.regime === 'NORMAL' ? 'border-blue-500 text-blue-500' :
                  volData.regime === 'ELEVATED' ? 'border-yellow-500 text-yellow-500' :
                  'border-red-500 text-red-500'
                }>
                  {volData.regime}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fear Index</span>
                <span className="font-bold text-lg">{volData.fearIndex?.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Annualized Vol</span>
                <span className="font-semibold">{(volData.realizedVolAnnualized * 100)?.toFixed(2)}%</span>
              </div>
            </div>
          ) : null}
        </Card>

        {/* Arb Navigator */}
        <Card className="glass p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold">Arb Navigator</h3>
            <Code className="w-4 h-4 text-secondary" />
          </div>

          {arbLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 text-secondary animate-spin" />
            </div>
          ) : arbData ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Opportunities</span>
                <span className="text-secondary font-bold">{arbData.summary?.totalOpportunities || 0}</span>
              </div>
              {arbData.opportunities?.slice(0, 2).map((opp: any, idx: number) => (
                <div key={idx} className="bg-black/20 rounded p-2 text-xs">
                  <div className="font-semibold mb-1">{opp.pair.join(' ↔ ')}</div>
                  <div className="text-muted-foreground">
                    Spread: <span className="text-secondary">{opp.spreadPct?.toFixed(3)}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </Card>

        {/* Sentiment Radar */}
        <Card className="glass p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold">Sentiment Radar</h3>
            <Activity className="w-4 h-4 text-secondary" />
          </div>

          {sentimentLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 text-secondary animate-spin" />
            </div>
          ) : sentimentData ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mood</span>
                <Badge variant="outline" className={
                  sentimentData.mood?.includes('GREED') ? 'border-green-500 text-green-500' :
                  sentimentData.mood?.includes('FEAR') ? 'border-red-500 text-red-500' :
                  'border-white/30'
                }>
                  {sentimentData.mood}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="text-center">
                  <div className="text-green-500 font-bold">{sentimentData.metrics?.bullishPercent?.toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">Bull</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{sentimentData.metrics?.neutralPercent?.toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">Neutral</div>
                </div>
                <div className="text-center">
                  <div className="text-red-500 font-bold">{sentimentData.metrics?.bearishPercent?.toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">Bear</div>
                </div>
              </div>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}

export default Developers;
