"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type State<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

/**
 * Lightweight data fetching hook (no external deps).
 * - Re-fetches on mount and when `refetch` is called.
 * - AbortController-safe (no setState on unmounted).
 * - Silently degrades on error (returns null data + error string).
 *
 * Use this instead of TanStack Query for simple one-off fetches
 * where you don't need caching/devtools/mutations.
 */
export function useFetch<T>(url: string, opts?: { enabled?: boolean }): State<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const mountedRef = useRef(true);

  const enabled = opts?.enabled ?? true;

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const ac = new AbortController();
    // Defer state updates to avoid cascading renders (per react-hooks rule)
    Promise.resolve().then(() => {
      if (mountedRef.current) {
        setLoading(true);
        setError(null);
      }
    });
    fetch(url, { signal: ac.signal, cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then((d) => {
        if (mountedRef.current) {
          setData(d);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (ac.signal.aborted) return;
        if (mountedRef.current) {
          setError(e instanceof Error ? e.message : "fetch failed");
          setLoading(false);
        }
      });
    return () => ac.abort();
  }, [url, enabled, tick]);

  return { data, loading, error, refetch };
}
