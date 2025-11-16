import { useState, useEffect } from 'react';

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
        setLoading(true);
        setError(null);

        const queryString = new URLSearchParams(params).toString();
        const url = `http://localhost:3001/api/agents/${agentType}${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (isMounted) {
          setData(result);
          setLoading(false);
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
