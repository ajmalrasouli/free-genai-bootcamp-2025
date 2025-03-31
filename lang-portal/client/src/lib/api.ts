// Use environment variable if available, otherwise use the default
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8003/api';

export async function fetchJson<T>(endpoint: string): Promise<T> {
  // Ensure endpoint starts with a / if not already
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
  // Ensure endpoint starts with a / if not already
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