import React from "react";
import { useRouter } from "next/navigation";

export default function ProceedButton() {
  const router = useRouter();
  return (
    <button
      className="flex items-center gap-2 group focus:outline-none cursor-pointer"
      onClick={() => router.push('/result')}
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
  );
} 