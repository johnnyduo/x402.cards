import { useState, useEffect } from 'react';

const CACHE_TTL = 10000; // 10 seconds cache

interface CacheEntry {
  data: any;
  timestamp: number;
}

export function useAgentData(
  agentType: string, 
  params: Record<string, string> = {},
  enabled: boolean = true // Add enabled parameter to control fetching
) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip fetching if not enabled
    if (!enabled) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        const queryString = new URLSearchParams(params).toString();
        const cacheKey = `agent_${agentType}_${queryString}`;
        
        // Check localStorage cache first
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          try {
            const cached: CacheEntry = JSON.parse(cachedData);
            const age = Date.now() - cached.timestamp;
            
            // Use cached data if less than TTL
            if (age < CACHE_TTL) {
              if (isMounted) {
                setData(cached.data);
                setLoading(false);
              }
              return;
            }
          } catch (e) {
            // Invalid cache, continue to fetch
          }
        }

        setLoading(true);
        setError(null);

        const url = `http://localhost:3001/api/agents/${agentType}${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (isMounted) {
          setData(result);
          setLoading(false);
          
          // Store in localStorage cache
          const cacheEntry: CacheEntry = {
            data: result,
            timestamp: Date.now()
          };
          try {
            localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
          } catch (e) {
            // localStorage full or disabled, continue without caching
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch agent data');
          setLoading(false);
        }
      }
    };

    fetchData();

    // Poll every 30 seconds when enabled
    const interval = setInterval(fetchData, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [agentType, JSON.stringify(params), enabled]);

  return { data, loading, error };
}
