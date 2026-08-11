import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PhysicalMenuPage() {
  const menus = [
    "/menu/menu-main.jpg",
    "/menu/menu-1.jpg",
    "/menu/menu-2.jpg",
    "/menu/menu-3.jpg"
  ];

  return (
    <main className="min-h-screen bg-[#0A0A0B] text-white py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[#DFB15B] hover:text-white transition-colors mb-10 font-bold tracking-wide">
          <span className="text-xl">←</span>
          <span>Back to Home</span>
        </Link>
        
        <div className="text-center mb-16">
          <p className="text-[#DFB15B] text-xs sm:text-sm tracking-[0.4em] uppercase font-bold mb-4">Complete Selection</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white mb-8">Our Physical Menu</h1>
          <div className="w-12 h-[2px] bg-[#DFB15B]/50 mx-auto" />
        </div>

        <div className="flex flex-col gap-8 md:gap-16 items-center">
          {menus.map((src, idx) => (
            <div key={idx} className="w-full relative group">
              <Image 
                src={src} 
                alt={`Menu Page ${idx + 1}`} 
                width={1200} 
                height={1600} 
                className="w-full h-auto rounded-2xl shadow-[0_0_50px_rgba(223,177,91,0.05)] border border-neutral-800 transition-all duration-500 group-hover:border-[#DFB15B]/40 group-hover:shadow-[0_0_50px_rgba(223,177,91,0.15)]"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
