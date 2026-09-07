"use client";

import { cn } from "@/lib/utils";

export function Tesseract({
  image,
  onEnter,
}: {
  image: string;
  onEnter: () => void;
}) {
  return (
    <div
      className="relative w-[250px] h-[250px] md:w-[400px] md:h-[400px] flex items-center justify-center group cursor-pointer z-20 mt-12 mb-16 no-color-transition animate-intro-zoom"
      onClick={onEnter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEnter();
        }
      }}
      aria-label="Enter Undimension"
    >
      <svg
        className="absolute inset-0 w-full h-full animate-spin-slow"
        viewBox="0 0 200 200"
        style={{ willChange: "transform" }}
      >
        <rect
          x="10"
          y="10"
          width="180"
          height="180"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-white group-hover:stroke-[#ff4d4d] transition-colors duration-500"
        />
        <rect
          x="55"
          y="55"
          width="90"
          height="90"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-white group-hover:stroke-[#00e5ff] transition-colors duration-500"
        />
        <line x1="10" y1="10" x2="55" y2="55" stroke="currentColor" strokeWidth="6" className="text-white" />
        <line x1="190" y1="10" x2="145" y2="55" stroke="currentColor" strokeWidth="6" className="text-white" />
        <line x1="10" y1="190" x2="55" y2="145" stroke="currentColor" strokeWidth="6" className="text-white" />
        <line x1="190" y1="190" x2="145" y2="145" stroke="currentColor" strokeWidth="6" className="text-white" />
      </svg>
      <div className="absolute w-[112.5px] h-[112.5px] md:w-[180px] md:h-[180px] flex items-center justify-center bg-black border-4 border-white shadow-[8px_8px_0_#fff] overflow-hidden animate-spin-rev group-hover:scale-125 transition-transform"
        style={{ willChange: "transform" }}
      >
        { }
        <img
          src={image}
          alt="Extracted Astronaut"
          className="absolute w-[220%] h-[220%] max-w-none object-cover contrast-[1.2]"
          style={{ clipPath: "circle(35% at 50% 50%)" }}
          loading="eager"
        />
      </div>
      <button
        className="absolute -bottom-16 -right-4 md:-right-12 bg-[#d4ff00] text-black font-bebas text-4xl md:text-6xl px-10 py-4 border-4 border-white shadow-[8px_8px_0_#fff] rotate-3 flex items-center gap-3 group-hover:bg-white group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:shadow-[16px_16px_0_#ff4d4d] transition-all no-color-transition"
        onClick={(e) => {
          e.stopPropagation();
          onEnter();
        }}
      >
        <span>ENTER</span>
        <span className="text-2xl md:text-4xl">➔</span>
      </button>
    </div>
  );
}
