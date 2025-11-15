import { useState, useEffect } from 'react';

export interface APIStatus {
  connected: boolean;
  twelveDataConnected: boolean;
  finnhubConnected: boolean;
  lastChecked: Date | null;
}

export interface AgentAPIData {
  signalForge?: {
    signal: string;
    price: number;
    sma20: number;
    sma50: number;
    rsi: number;
    volatility: number;
  };
  volatilityPulse?: {
    volatility: number;
    regime: string;
    fearIndex: number;
  };
  arbNavigator?: {
    opportunities: Array<{
      venue1: string;
      venue2: string;
      spread: number;
      profitability: number;
    }>;
  };
  sentimentRadar?: {
    sentiment: number;
    mood: string;
    news: Array<{
      headline: string;
      sentiment: number;
    }>;
  };
}

const API_BASE_URL = import.meta.env.PROD 
  ? '' // Vercel will use same origin
  : 'http://localhost:3001';

export function useAPIStatus() {
  const [status, setStatus] = useState<APIStatus>({
    connected: false,
    twelveDataConnected: false,
    finnhubConnected: false,
    lastChecked: null,
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatus({
          connected: true,
          twelveDataConnected: data.twelveData === 'Connected',
          finnhubConnected: data.finnhub === 'Connected',
          lastChecked: new Date(),
        });
      } else {
        setStatus({
          connected: false,
          twelveDataConnected: false,
          finnhubConnected: false,
          lastChecked: new Date(),
        });
      }
    } catch (error) {
      console.error('API health check failed:', error);
      setStatus({
        connected: false,
        twelveDataConnected: false,
        finnhubConnected: false,
        lastChecked: new Date(),
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return { status, isChecking, refetch: checkStatus };
}

export function useAgentLiveData(agentId: number) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    const endpoints: { [key: number]: string } = {
      1: '/api/agents/signal-forge?symbol=BTC/USD',
      2: '/api/agents/volatility-pulse?symbol=BTC/USD',
      3: '/api/agents/arb-navigator',
      4: '/api/agents/sentiment-radar?symbol=bitcoin',
      5: '/api/agents/risk-sentinel',
    };

    const endpoint = endpoints[agentId];
    if (!endpoint) {
      setError('Invalid agent ID');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(`Failed to fetch data for agent ${agentId}:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [agentId]);

  return { data, isLoading, error, refetch: fetchData };
}
