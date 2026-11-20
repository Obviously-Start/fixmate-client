"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { API_URL } from "./constants";

let cached: { token: string; expires: number } | null = null;

export function clearTokenCache() {
  cached = null;
}


async function getToken() {
  if (cached && cached.expires > Date.now()) return cached.token;
  const res = await fetch("/api/token", { credentials: "include" });
  if (!res.ok) throw new Error("Please sign in first");
  const { token } = await res.json();
  cached = { token, expires: Date.now() + 50 * 60 * 1000 };
  return token as string;
}


export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Something went wrong");
  return json as T;
}


export function useFetch<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch<{ data: T }>(path);
      setData(res.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, reload: load };
}