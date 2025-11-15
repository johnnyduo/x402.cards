import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Key, Code, Webhook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default Developers;
