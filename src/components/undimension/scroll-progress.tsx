"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.documentElement;
        const scrollHeight = el.scrollHeight - el.clientHeight;
        const current = el.scrollTop;
        setWidth(scrollHeight > 0 ? (current / scrollHeight) * 100 : 0);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-2 bg-[#ff4d4d] z-[60] no-color-transition"
      style={{ width: `${width}%` }}
    />
  );
}
