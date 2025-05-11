"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import BackButton from "../../components/BackButton";
import ProceedButton from "../../components/ProceedButton";

const SQUARES = [
  { size: 420, speed: 36 },
  { size: 340, speed: 24 },
  { size: 260, speed: 16 },
];

function onlyLetters(str: string) {
  return /^[A-Za-z\s]+$/.test(str);
}

export default function TestingPage() {
  const [step, setStep] = useState<"name" | "city" | "loading" | "thankyou">("name");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onlyLetters(name.trim())) {
      setError("Please enter a valid name (letters only)");
      return;
    }
    setError("");
    setStep("city");
  };

  const handleCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onlyLetters(city.trim())) {
      setError("Please enter a valid city name (letters only)");
      return;
    }
    setError("");
    setStep("loading");
    // Show loading while posting
    await new Promise(res => setTimeout(res, 1200)); // Simulate network latency
    await fetch("https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location: city }),
    });
    setStep("thankyou");
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Header />
      <div className="absolute left-8 bottom-8">
        <BackButton />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative flex items-center justify-center" style={{ width: 440, height: 440 }}>
          {/* Rotating Squares */}
          {SQUARES.map((sq, i) => (
            <div
              key={i}
              className={`absolute border border-dotted border-gray-300 rounded-none pointer-events-none`}
              style={{
                width: sq.size,
                height: sq.size,
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) rotate(0deg)` /* will animate with CSS */,
                animation: `rotate${i} ${sq.speed}s linear infinite`,
              }}
            />
          ))}
          {/* Center Content */}
          <div className="flex flex-col items-center justify-center w-full h-full">
            {step === "name" && (
              <form onSubmit={handleNameSubmit} className="w-full flex flex-col items-center">
                <span className="mb-2 text-sm text-gray-400">CLICK TO TYPE</span>
                <input
                  autoFocus
                  className="text-center text-4xl font-light border-b border-black outline-none bg-transparent placeholder-black/60 py-2 w-80"
                  placeholder="Introduce Yourself"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  pattern="[A-Za-z\s]+"
                  title="Letters only"
                  maxLength={32}
                />
                {error && <span className="text-red-500 text-xs mt-2">{error}</span>}
              </form>
            )}
            {step === "city" && (
              <form onSubmit={handleCitySubmit} className="w-full flex flex-col items-center">
                <span className="mb-2 text-sm text-gray-400">CLICK TO TYPE</span>
                <input
                  autoFocus
                  className="text-center text-4xl font-light border-b border-black outline-none bg-transparent placeholder-black/60 py-2 w-80"
                  placeholder="your city name"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  pattern="[A-Za-z\s]+"
                  title="Letters only"
                  maxLength={32}
                />
                {error && <span className="text-red-500 text-xs mt-2">{error}</span>}
              </form>
            )}
            {step === "loading" && (
              <div className="flex flex-col items-center">
                <span className="mb-6 text-lg tracking-wider text-gray-700">processing information</span>
                <div className="flex space-x-2">
                  <span className="dot bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="dot bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="dot bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            {step === "thankyou" && (
              <div className="flex flex-col items-center">
                <span className="mb-4 text-3xl font-semibold text-black">Thank You!</span>
                <span className="mb-8 text-md text-gray-500">Proceed for the next step</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {step === "thankyou" && (
        <div className="absolute right-8 bottom-8 animate-slide-in">
          <ProceedButton />
        </div>
      )}
      <style jsx global>{`
        @keyframes rotate0 { 100% { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes rotate1 { 100% { transform: translate(-50%, -50%) rotate(-360deg); } }
        @keyframes rotate2 { 100% { transform: translate(-50%, -50%) rotate(720deg); } }
        
        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: translateX(-50vw);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
        }
        
        .dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: inline-block;
        }
        .animate-bounce {
          animation: bounce 0.7s infinite alternate;
        }
        @keyframes bounce {
          to { transform: translateY(-16px); }
        }
      `}</style>
    </div>
  );
} 