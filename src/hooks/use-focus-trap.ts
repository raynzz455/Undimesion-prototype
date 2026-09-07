"use client";

import { useEffect } from "react";

/**
 * Focus trap hook for modal/dialog overlays.
 *
 * - Traps Tab/Shift+Tab within the container.
 * - Moves focus into the container on mount (first focusable or the container itself).
 * - Restores focus to the previously-focused element on unmount.
 *
 * Usage:
 *   const ref = useRef<HTMLDivElement>(null);
 *   useFocusTrap(ref, isActive);
 *
 * Pass `isActive=false` to disable (e.g. when modal closed).
 */
export function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  isActive: boolean,
) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const container = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Selector for focusable elements
    const selector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusable = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(selector),
      ).filter((el) => el.offsetParent !== null); // visible only

    // Move focus in
    const focusable = getFocusable();
    if (focusable.length > 0) {
      // Focus the close button if present, else first focusable
      const closeBtn = focusable.find((el) =>
        el.getAttribute("aria-label")?.toLowerCase().includes("close"),
      );
      (closeBtn ?? focusable[0]).focus();
    } else {
      container.focus();
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first || !container.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !container.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKey);

    return () => {
      container.removeEventListener("keydown", handleKey);
      // Restore focus to the element that opened the modal
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [isActive, ref]);
}
