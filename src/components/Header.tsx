import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-8 pt-4 flex justify-between items-center">
        <nav className="hidden md:flex gap-4">
          <Link href="/" className="text-[10px] hover:opacity-70 transition-opacity font-bold">
            SKINSTRIC
          </Link>
          <p className="text-[10px] text-gray-500 transition-opacity">
            [ INTRO ]
          </p>
        </nav>
        <button className="text-[10px] text-white bg-black px-4 py-1 tracking-tighter">ENTER CODE</button>
      </div>
    </header>
  );
} 