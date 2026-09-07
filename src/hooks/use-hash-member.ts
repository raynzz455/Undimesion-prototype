"use client";

import { useEffect } from "react";

/**
 * Deep-link hash listener.
 * Listens for `#member-{id}` URL hashes and calls the callback with the id.
 * Used to auto-open member modals when a shared URL is visited.
 *
 * Format: `#member-aldi`, `#member-razka`, etc.
 */
export function useHashMember(onMember: (id: string) => void) {
  useEffect(() => {
    const check = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#member-(.+)$/);
      if (match) {
        onMember(match[1]);
        // Clear the hash so re-opening works cleanly
        if (history.replaceState) {
          history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      }
    };

    // Check on mount (for direct visits to shared URLs)
    // Slight delay to ensure the page has rendered
    const t = setTimeout(check, 300);

    // Listen for hash changes (back/forward, manual edit)
    window.addEventListener("hashchange", check);
    return () => {
      clearTimeout(t);
      window.removeEventListener("hashchange", check);
    };
  }, [onMember]);
}
