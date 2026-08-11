import React from 'react';
import Image from 'next/image';

export function AromaHero() {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/ambience/dinning.jpg"
          alt="Aroma Fine Dine Ambience"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#0A0A0B]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <p className="text-[#DFB15B] font-serif text-sm md:text-base tracking-[0.4em] uppercase mb-4 font-bold">
            Welcome to
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-cinzel text-white leading-tight mb-6">
            Aroma Fine Dine<br />
            <span className="text-2xl sm:text-3xl md:text-4xl text-neutral-300">Restaurant & Banquet Hall</span>
          </h1>
        </div>
        
        <div className="w-16 h-[2px] bg-[#DFB15B] mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }} />

        <p className="text-xl sm:text-2xl font-serif text-white/90 italic mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          "Where Sophistication Meets Flavor in Hanamkonda."
        </p>

        <p className="text-sm sm:text-base md:text-lg text-neutral-300 font-light max-w-3xl leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          One of the largest hangout spots in Hanamkonda featuring a unique street-view dining experience, beautiful candlelight dinners, and a fully equipped banquet facility.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          <button 
            onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-[#DFB15B] text-black font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors duration-300"
          >
            Explore Menu
          </button>
          <button 
            onClick={() => document.getElementById('banquet-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 border border-[#DFB15B] text-[#DFB15B] font-bold uppercase tracking-wider text-sm hover:bg-[#DFB15B] hover:text-black transition-colors duration-300"
          >
            Discover Banquet
          </button>
        </div>
      </div>
    </section>
  );
}
