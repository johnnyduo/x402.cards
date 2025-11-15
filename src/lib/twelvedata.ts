// Twelve Data API client
const BASE_URL = 'https://api.twelvedata.com';
const API_KEY = import.meta.env.TWELVEDATA_API_KEY || '87f2fa4ff46945ff84fef04b9edaee07';

async function tdGet<T>(path: string, params: Record<string, string | number>) {
  const url = new URL(path, BASE_URL);
  Object.entries({ ...params, apikey: API_KEY }).forEach(([k, v]) =>
    url.searchParams.append(k, String(v))
  );

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TwelveData error: ${res.status}`);
  const json = await res.json();
  if ((json as any).status === 'error') {
    throw new Error(`TwelveData API error: ${(json as any).message}`);
  }
  return json as T;
}

export { tdGet };
