const API_BASE = 'http://localhost:8003/api';

export async function fetchJson<T>(endpoint: string): Promise<T> {
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${formattedEndpoint}`;
  console.log(`Fetching from: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  const data = await response.json();
  console.log(`Response from ${url}:`, data);
  return data;
}

export async function postJson<T>(endpoint: string, data?: any): Promise<T> {
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${formattedEndpoint}`;
  console.log(`Posting to: ${url}`, data);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
} 