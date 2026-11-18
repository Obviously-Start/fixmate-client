import { API_URL } from "./constants";

export async function publicFetch<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load data from server");
  const json = await res.json();
  return json.data as T;
}