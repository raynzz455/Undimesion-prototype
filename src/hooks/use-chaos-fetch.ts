"use client";

export function useChaosFetch() {
  const chaosFetch = async (url: string, options: RequestInit = {}) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("ud-chaos-token") : null;
    const headers = new Headers(options.headers);
    if (token) headers.set("x-chaos-token", token);
    if (options.body && !headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    return fetch(url, { ...options, headers });
  };
  return { chaosFetch };
}
