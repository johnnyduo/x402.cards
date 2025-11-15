// Finnhub API client
const BASE_URL = 'https://finnhub.io/api/v1';
const API_KEY = import.meta.env.FINNHUB_API_KEY || 'd4caq6hr01qudf6henrgd4caq6hr01qudf6hens0';

async function fhGet<T>(endpoint: string, params: Record<string, string | number> = {}) {
  const url = new URL(endpoint, BASE_URL);
  Object.entries({ ...params, token: API_KEY }).forEach(([k, v]) =>
    url.searchParams.append(k, String(v))
  );

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Finnhub error: ${res.status}`);
  const json = await res.json();
  if ((json as any).error) {
    throw new Error(`Finnhub API error: ${(json as any).error}`);
  }
  return json as T;
}

export { fhGet };
