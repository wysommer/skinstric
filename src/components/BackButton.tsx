import React from "react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      className="flex items-center gap-2 group focus:outline-none cursor-pointer"
      onClick={() => router.back()}
      aria-label="Go back"
    >
      <span className="relative w-10 h-10 block">
        {/* Rotated square */}
        <span
          className="absolute inset-0 border border-black"
          style={{ transform: "rotate(45deg)" }}
        />
        {/* Left arrow (triangle) */}
        <svg
          viewBox="0 0 16 16"
          className="absolute left-1 top-1/2 -translate-y-1/2"
          width={24}
          height={24}
          fill="none"
        >
          <polygon points="11,3 4,8 11,13" fill="#444" />
        </svg>
      </span>
      <span className="text-md text-black font-md tracking-wide group-hover:underline ml-4">BACK</span>
    </button>
  );
} 