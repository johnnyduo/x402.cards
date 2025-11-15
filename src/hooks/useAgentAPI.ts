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
    // Check localStorage cache first (30 second TTL)
    const cachedStatus = localStorage.getItem('api-health-status');
    if (cachedStatus) {
      try {
        const parsed = JSON.parse(cachedStatus);
        if (Date.now() - parsed.timestamp < 30000) {
          setStatus({
            ...parsed.status,
            lastChecked: new Date(parsed.status.lastChecked)
          });
          return;
        }
      } catch (e) {
        // Invalid cache, continue to fetch
      }
    }

    setIsChecking(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        const newStatus = {
          connected: true,
          twelveDataConnected: data.twelveData === 'Connected',
          finnhubConnected: data.finnhub === 'Connected',
          lastChecked: new Date(),
        };
        setStatus(newStatus);
        
        // Cache in localStorage
        localStorage.setItem('api-health-status', JSON.stringify({
          status: newStatus,
          timestamp: Date.now()
        }));
      } else {
        const newStatus = {
          connected: false,
          twelveDataConnected: false,
          finnhubConnected: false,
          lastChecked: new Date(),
        };
        setStatus(newStatus);
        localStorage.setItem('api-health-status', JSON.stringify({
          status: newStatus,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.error('API health check failed:', error);
      const newStatus = {
        connected: false,
        twelveDataConnected: false,
        finnhubConnected: false,
        lastChecked: new Date(),
      };
      setStatus(newStatus);
      localStorage.setItem('api-health-status', JSON.stringify({
        status: newStatus,
        timestamp: Date.now()
      }));
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

    const cacheKey = `agent-data-${agentId}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    // Check localStorage cache (60 second TTL)
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (Date.now() - parsed.timestamp < 60000) {
          setData(parsed.data);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        // Invalid cache, continue to fetch
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      // Cache in localStorage
      localStorage.setItem(cacheKey, JSON.stringify({
        data: result,
        timestamp: Date.now()
      }));
      
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
