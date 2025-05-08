"use client";

import { useState } from "react";
import Header from "@/components/Header";

export default function Home() {
  const [hoveredButton, setHoveredButton] = useState<"left" | "right" | null>(
    null
  );

  return (
    <div className="h-screen bg-white relative overflow-hidden">
      <Header />

      {/* Main Content */}
      <main className="h-full flex items-center justify-center relative">
        {/* Decorative Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left Lines */}
          <div
            className={`absolute left-0 top-4 w-[1px] h-[67.5vh] bg-gray-300 origin-top-left -rotate-45 ${
              hoveredButton === "right" ? "opacity-0" : "opacity-100"
            }`}
          ></div>
          <div
            className={`absolute left-0 bottom-4 w-[1px] h-[67.5vh] bg-gray-300 origin-bottom-left rotate-45 ${
              hoveredButton === "right" ? "opacity-0" : "opacity-100"
            }`}
          ></div>
          {/* Right Lines */}
          <div
            className={`absolute right-0 top-4 w-[1px] h-[67.5vh] bg-gray-300 origin-top-right rotate-45 ${
              hoveredButton === "left" ? "opacity-0" : "opacity-100"
            }`}
          ></div>
          <div
            className={`absolute right-0 bottom-4 w-[1px] h-[67.5vh] bg-gray-300 origin-bottom-right -rotate-45 ${
              hoveredButton === "left" ? "opacity-0" : "opacity-100"
            }`}
          ></div>
        </div>

        {/* Title */}
        <div
          className={`transition-all duration-1000 ease-in-out ${
            hoveredButton === "right"
              ? "translate-x-[-20vw]"
              : hoveredButton === "left"
              ? "translate-x-[20vw]"
              : "translate-x-0"
          }`}
        >
          <div className="text-7xl md:text-8xl tracking-tighter flex flex-col items-center">
            <div
              className={`transition-all duration-1000 ease-in-out ${
                hoveredButton === "right"
                  ? "translate-x-[-10%]"
                  : hoveredButton === "left"
                  ? "translate-x-[10%]"
                  : "translate-x-0"
              }`}
            >
              Sophisticated
            </div>
            <div
              className={`transition-all duration-1000 ease-in-out ${
                hoveredButton === "right"
                  ? "translate-x-[-40%]"
                  : hoveredButton === "left"
                  ? "translate-x-[40%]"
                  : "translate-x-0"
              }`}
            >
              skincare
            </div>
          </div>
        </div>

        {/* Left Button */}
        <button
          className={`absolute left-20 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm hover:opacity-70 transition-all duration-1000 ease-in-out cursor-pointer ${
            hoveredButton === "right"
              ? "opacity-0 translate-x-[-100px]"
              : "opacity-100 translate-x-0"
          }`}
          onMouseEnter={() => setHoveredButton("left")}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <div className="w-7 h-7 border border-black rotate-45 flex items-center justify-center">
            <span className="-rotate-45">◀</span>
          </div>
          DISCOVER A.I.
        </button>

        {/* Right Button */}
        <a href="/testing">
          <button
            className={`absolute right-20 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm hover:opacity-70 transition-all duration-1000 ease-in-out cursor-pointer ${
              hoveredButton === "left"
                ? "opacity-0 translate-x-[100px]"
                : "opacity-100 translate-x-0"
            }`}
            onMouseEnter={() => setHoveredButton("right")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            TAKE TEST
            <div className="w-7 h-7 border border-black rotate-45 flex items-center justify-center">
              <span className="-rotate-45">▶</span>
            </div>
          </button>
        </a>

        {/* Bottom Text */}
        <p className="absolute bottom-8 left-8 text-sm max-w-sm uppercase">
          SkinStric developed an A.I. that creates a
          <br /> highly-personalized routine tailored to
          <br /> what your skin needs.
        </p>
      </main>
    </div>
  );
}
