"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-reveal hook using IntersectionObserver.
 * Attaches `.is-visible` to elements with `.ud-reveal` class when they enter
 * the viewport. Respects prefers-reduced-motion.
 *
 * Usage: call `useScrollReveal()` once near the top of a page component.
 * It auto-scans the document and observes all `.ud-reveal` elements.
 */
export function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(".ud-reveal"),
    );

    if (prefersReduced) {
      targets.forEach((t) => t.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.revealDelay;
            if (delay) {
              el.style.transitionDelay = `${delay}ms`;
            }
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    observerRef.current = observer;
    targets.forEach((t) => observer.observe(t));

    return () => {
      observer.disconnect();
    };
  }, []);
}
