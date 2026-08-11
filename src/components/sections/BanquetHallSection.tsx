import React from 'react';
import Image from 'next/image';

export function BanquetHallSection() {
  return (
    <section id="banquet-section" className="w-full py-20 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Images Grid */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
            <div className="col-span-2 relative h-64 sm:h-80 rounded-lg overflow-hidden border border-[#DFB15B]/30">
              <Image 
                src="/ambience/banquent hall (bh) view.jpg" 
                alt="Banquet Hall View" 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="relative h-40 sm:h-48 rounded-lg overflow-hidden border border-[#DFB15B]/30">
              <Image 
                src="/ambience/green rooms.jpg" 
                alt="Green Rooms" 
                fill 
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="relative h-40 sm:h-48 rounded-lg overflow-hidden border border-[#DFB15B]/30">
              <Image 
                src="/ambience/lighting.jpg" 
                alt="Lighting Ambience" 
                fill 
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-700" 
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <p className="text-[#DFB15B] text-xs sm:text-sm tracking-[0.4em] uppercase font-bold mb-4">Celebrations</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel text-white mb-6">Banquet Hall</h2>
            <div className="w-12 h-[2px] bg-[#DFB15B] mb-8" />
            
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed font-light mb-8">
              Host your memorable events with us. Our fully equipped banquet facility accommodates up to 200 guests, making it the perfect venue for weddings, birthday parties, and corporate events.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#111112] p-5 rounded border border-[#222]">
                <h4 className="text-[#DFB15B] font-serif text-lg mb-2">Pricing (Estimate)</h4>
                <ul className="text-neutral-300 space-y-2 text-sm">
                  <li><span className="font-semibold text-white">Vegetarian:</span> ~₹550 per person</li>
                  <li><span className="font-semibold text-white">Non-Vegetarian:</span> ~₹650 per person</li>
                </ul>
              </div>
              <div className="bg-[#111112] p-5 rounded border border-[#222]">
                <h4 className="text-[#DFB15B] font-serif text-lg mb-2">Amenities</h4>
                <ul className="text-neutral-300 space-y-2 text-sm">
                  <li>❄️ Fully Air-Conditioned</li>
                  <li>🛋️ Private Bridal Suite</li>
                  <li>🎵 Professional DJ Setup</li>
                  <li>♿ Wheelchair Accessible</li>
                </ul>
              </div>
            </div>

            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="self-start px-8 py-3 bg-[#DFB15B] text-black font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors duration-300"
            >
              Book Now
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
}
