import { GraphData, ReviewResponse } from './types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

async function fetchJson<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getGraph(): Promise<GraphData> {
  return fetchJson<GraphData>(`${API}/graph`);
}

export async function postReview(task: string): Promise<ReviewResponse> {
  return fetchJson<ReviewResponse>(`${API}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task }),
  });
}
