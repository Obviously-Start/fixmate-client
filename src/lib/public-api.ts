import { API_URL } from "./constants";
import type { Pagination } from "./types";

export async function publicFetch<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load data from server");
  const json = await res.json();
  return json.data as T;
}


export async function publicFetchPaged<T>(path: string): Promise<{ data: T[]; pagination: Pagination }> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load data from server");
  const json = await res.json();
  const data: T[] = json.data ?? [];
  return {
    data,
    pagination: json.pagination ?? { page: 1, limit: data.length || 12, total: data.length, totalPages: 1 },
  };
}