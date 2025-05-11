"use client";
import Link from "next/link";
import Header from "@/components/Header";
import { useState, useRef } from "react";

const SQUARES = [
  { label: "DEMOGRAPHICS", key: "demographics", link: "/summary", dark: true },
  { label: "COSMETIC CONCERNS", key: "cosmetic", link: null, dark: false },
  { label: "SKIN TYPE DETAILS", key: "skin", link: null, dark: false },
  { label: "WEATHER", key: "weather", link: null, dark: false },
];

export default function SelectPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState(0);
  const [retreat, setRetreat] = useState(false);
  const [holdOut, setHoldOut] = useState(false);
  const lastHovered = useRef<string | null>(null);

  // Handle hover logic for pulse and retreat
  const handleHover = (square: string | null) => {
    if (square && square !== lastHovered.current) {
      setPulseKey(prev => prev + 1); // retrigger pulse
      setRetreat(false);
      setHoldOut(false);
      // After pulse, hold out
      setTimeout(() => setHoldOut(true), 700); // match pulse duration
    } else if (!square) {
      setRetreat(true); // trigger retreat
      setHoldOut(false);
      setTimeout(() => setRetreat(false), 300); // retreat duration
    }
    setHovered(square);
    lastHovered.current = square;
  };

  // Diamond layout: 0=top, 1=right, 2=left, 3=bottom
  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative" style={{ width: 400, height: 400 }}>
          {/* Pulsing border on hover */}
          {(hovered || retreat) && (
            <div
              key={pulseKey + (retreat ? '-retreat' : holdOut ? '-hold' : '')}
              className={
                retreat
                  ? "absolute left-1/2 top-1/2 z-10 pointer-events-none animate-pulse-retreat"
                  : holdOut
                  ? "absolute left-1/2 top-1/2 z-10 pointer-events-none border-hold"
                  : "absolute left-1/2 top-1/2 z-10 pointer-events-none animate-pulse-once"
              }
              style={{
                width: 320,
                height: 320,
                transform: "translate(-50%, -50%) rotate(45deg)",
                border: "2px solid #bbb",
                borderRadius: 0,
                opacity: 0.7,
              }}
            />
          )}
          {/* Diamond squares */}
          {/* Top */}
          <Square
            label="DEMOGRAPHICS"
            position="top"
            dark
            link="/summary"
            hovered={hovered === "top"}
            setHovered={v => handleHover(v ? "top" : null)}
          />
          {/* Left */}
          <Square
            label="COSMETIC CONCERNS"
            position="left"
            hovered={hovered === "left"}
            setHovered={v => handleHover(v ? "left" : null)}
          />
          {/* Right */}
          <Square
            label="SKIN TYPE DETAILS"
            position="right"
            hovered={hovered === "right"}
            setHovered={v => handleHover(v ? "right" : null)}
          />
          {/* Bottom */}
          <Square
            label="WEATHER"
            position="bottom"
            hovered={hovered === "bottom"}
            setHovered={v => handleHover(v ? "bottom" : null)}
          />
        </div>
      </div>
      <style jsx global>{`
        .animate-pulse-once {
          animation: pulse-border-once 0.7s cubic-bezier(0.4,0,0.2,1) 1;
        }
        @keyframes pulse-border-once {
          0% { opacity: 0.7; transform: translate(-50%, -50%) scale(1) rotate(45deg); }
          70% { opacity: 0.2; transform: translate(-50%, -50%) scale(1.3) rotate(45deg); }
          100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1.3) rotate(45deg); }
        }
        .border-hold {
          opacity: 0.3 !important;
          transform: translate(-50%, -50%) scale(1.3) rotate(45deg) !important;
          transition: opacity 0.2s, transform 0.2s;
        }
        .animate-pulse-retreat {
          animation: pulse-border-retreat 0.3s cubic-bezier(0.4,0,0.2,1) 1;
        }
        @keyframes pulse-border-retreat {
          0% { opacity: 0.3; transform: translate(-50%, -50%) scale(1.3) rotate(45deg); }
          100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1) rotate(45deg); }
        }
      `}</style>
    </div>
  );
}

function Square({ label, position, dark, link, hovered, setHovered }: {
  label: string;
  position: "top" | "left" | "right" | "bottom";
  dark?: boolean;
  link?: string | null;
  hovered: boolean;
  setHovered: (v: boolean) => void;
}) {
  // Positioning for diamond
  const base = "absolute w-40 h-40 flex items-center justify-center text-center text-md font-semibold select-none transition-all duration-200";
  let posStyle = {};
  if (position === "top") posStyle = { left: "50%", top: 0, transform: "translate(-50%, 0) rotate(45deg)" };
  if (position === "left") posStyle = { left: 0, top: "50%", transform: "translate(0, -50%) rotate(45deg)" };
  if (position === "right") posStyle = { right: 0, top: "50%", transform: "translate(0, -50%) rotate(45deg)" };
  if (position === "bottom") posStyle = { left: "50%", bottom: 0, transform: "translate(-50%, 0) rotate(45deg)" };
  const color = dark ? "bg-gray-300 text-black" : "bg-gray-100 text-black";
  const cursor = link ? "cursor-pointer" : "cursor-not-allowed";
  const scale = hovered ? "scale-105 shadow-lg z-20" : "";
  const hoverStyle = hovered ? "ring-2 ring-gray-400" : "";
  const content = (
    <div
      className={`${base} ${color} ${cursor} ${hoverStyle} ${scale}`}
      style={posStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ transform: "rotate(-45deg)", display: "block", width: "100%" }}>{label}</span>
    </div>
  );
  if (link) {
    return <Link href={link}>{content}</Link>;
  }
  return content;
} 