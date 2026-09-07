"use client";

import { StarField } from "./star-field";
import { Blackhole, Planets } from "./cosmic";
import { Tesseract } from "./tesseract";

export function OpeningScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#09090b] overflow-hidden selection:bg-[#ff4d4d] selection:text-white">
      <StarField variant="dark" />
      <div className="ud-grain" aria-hidden />
      <Blackhole />
      <Planets />
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-4">
        <h1
          className="font-bebas text-[110px] md:text-[180px] lg:text-[240px] leading-[0.8] uppercase text-white drop-shadow-md relative z-10 animate-intro-text ud-glitch"
          data-text="UNDIMENSION"
          style={{ textShadow: "10px 10px 0px #00e5ff" }}
        >
          UNDIMENSION
        </h1>
        <Tesseract image="/members/opening.webp" onEnter={onEnter} />
        <p className="font-outfit text-lg md:text-2xl font-black border-4 border-white bg-[#ff4d4d] text-white px-8 py-4 shadow-[8px_8px_0_#fff] max-w-xl -rotate-2 uppercase relative z-10 hover:rotate-0 hover:scale-105 transition-all no-color-transition animate-intro-fade">
          Initiate launch sequence to the collective.
        </p>
      </div>
    </div>
  );
}
