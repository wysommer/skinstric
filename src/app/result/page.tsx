"use client";

import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const SQUARES = [
  { size: 320, speed: 36 },
  { size: 240, speed: 24 },
  { size: 160, speed: 16 },
];

export default function ResultPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  // Helper to convert image url to base64
  const getBase64FromUrl = async (url: string) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
      reader.onerror = reject;
    });
  };

  const handleProceed = async () => {
    if (!selectedImage) return;
    setLoading(true);
    try {
      const base64 = await getBase64FromUrl(selectedImage);
      const res = await fetch("https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      const result = await res.json();
      localStorage.setItem('skinstric-demographics', JSON.stringify(result.data));
      router.push("/select");
    } catch (e) {
      console.error('Error processing image:', e);
      setLoading(false);
      alert("Failed to process image. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="relative flex items-center justify-center" style={{ width: 440, height: 440 }}>
            {[
              { size: 420, speed: 36 },
              { size: 340, speed: 24 },
              { size: 260, speed: 16 },
            ].map((sq, i) => (
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
            <div className="flex flex-col items-center justify-center w-full h-full">
              <span className="mb-6 text-lg tracking-wider text-gray-700">Preparing Your Analysis</span>
              <div className="flex space-x-2">
                <span className="dot bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="dot bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="dot bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        </div>
        <style jsx global>{`
          @keyframes rotate0 { 100% { transform: translate(-50%, -50%) rotate(360deg); } }
          @keyframes rotate1 { 100% { transform: translate(-50%, -50%) rotate(-360deg); } }
          @keyframes rotate2 { 100% { transform: translate(-50%, -50%) rotate(720deg); } }
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

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Header />
      {/* Image Preview */}
      {selectedImage && (
        <div className="absolute right-8 top-24 flex flex-col items-center gap-2">
          <div className="w-36 h-36 border border-gray-200 rounded-lg overflow-hidden">
            <Image
              src={selectedImage}
              alt="Selected image preview"
              width={144}
              height={144}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm text-gray-600 font-medium">Selected Image</span>
        </div>
      )}
      <div className="absolute left-8 bottom-8">
        <BackButton />
      </div>
      {selectedImage && (
        <div className="absolute right-8 bottom-8 animate-slide-in">
          <button
            className="flex items-center gap-2 group focus:outline-none cursor-pointer"
            onClick={handleProceed}
            aria-label="Proceed to next step"
          >
            <span className="text-md text-black font-md tracking-wide group-hover:underline mr-4">PROCEED</span>
            <span className="relative w-10 h-10 block">
              {/* Rotated square */}
              <span
                className="absolute inset-0 border border-black"
                style={{ transform: "rotate(45deg)" }}
              />
              {/* Right arrow (triangle) */}
              <svg
                viewBox="0 0 16 16"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                width={24}
                height={24}
                fill="none"
              >
                <polygon points="5,3 12,8 5,13" fill="#444" />
              </svg>
            </span>
          </button>
        </div>
      )}
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
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
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer" onClick={handleGalleryClick}>
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
      `}</style>
    </div>
  );
} 