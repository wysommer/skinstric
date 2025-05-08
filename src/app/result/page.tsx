"use client";

import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Image from "next/image";

const SQUARES = [
  { size: 320, speed: 36 },
  { size: 240, speed: 24 },
  { size: 160, speed: 16 },
];

export default function ResultPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Header />
      <div className="absolute left-8 bottom-8">
        <BackButton />
      </div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-row gap-55 items-center justify-center">
          {/* Left Rotating Squares with Camera Image */}
          <div className="relative flex items-center justify-center" style={{ width: 340, height: 340 }}>
            {SQUARES.map((sq, i) => (
              <div
                key={i}
                className="absolute border border-dotted border-gray-300 rounded-none pointer-events-none"
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
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <Image src="/images/camera.png" alt="Camera" width={100} height={100} />
            </div>
            {/* Camera line and caption */}
            <div className="absolute left-1/2 top-1/2 z-20">
              <div className="relative">
                <div className="absolute w-24 h-[1px] bg-gray-400 transform -rotate-45 origin-left translate-x-12 -translate-y-12" />
                <div className="absolute left-24 top-0 -translate-y-40 translate-x-10 text-xs text-gray-600 font-medium">
                  ALLOW A.I. TO SCAN YOUR FACE
                </div>
              </div>
            </div>
          </div>
          {/* Right Rotating Squares with Gallery Image */}
          <div className="relative flex items-center justify-center" style={{ width: 340, height: 340 }}>
            {SQUARES.map((sq, i) => (
              <div
                key={i}
                className="absolute border border-dotted border-gray-300 rounded-none pointer-events-none"
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
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <Image src="/images/gallery.png" alt="Gallery" width={100} height={100} />
            </div>
            {/* Gallery line and caption */}
            <div className="absolute left-1/2 top-1/2 z-20">
              <div className="relative">
                <div className="absolute w-24 h-[1px] bg-gray-400 transform -rotate-45 origin-bottom -translate-x-30 translate-y-18" />
                <div className="absolute right-27 top-0 translate-y-24 text-xs text-gray-600 font-medium">
                  ALLOW A.I. TO ACCESS GALLERY
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes rotate0 { 100% { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes rotate1 { 100% { transform: translate(-50%, -50%) rotate(-360deg); } }
        @keyframes rotate2 { 100% { transform: translate(-50%, -50%) rotate(720deg); } }
      `}</style>
    </div>
  );
} 