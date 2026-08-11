'use client';
import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { MagneticButton } from './MagneticButton';
import { OptimizedImage } from './OptimizedImage';

import { MenuItem, CartItem } from '@/types';

interface MenuCardProps {
  item: MenuItem;
  cartItems: CartItem[];
  onIncrease: (id: string, portion: string) => void;
  onDecrease: (id: string, portion: string) => void;
  onAdd: (item: Omit<CartItem, 'qty'>) => void;
}

export function MenuCard({ item, cartItems, onIncrease, onDecrease, onAdd }: MenuCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const portionKeys = Object.keys(item.prices);
  const [selectedPortion, setSelectedPortion] = useState(portionKeys[0] || "Regular");
  
  // Mouse position for subtle parallax
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { damping: 20, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  // Convert 0-1 range to a small pixel offset (-8 to +8)
  const translateX = useMotionTemplate`calc((${springX} - 0.5) * -16px)`;
  const translateY = useMotionTemplate`calc((${springY} - 0.5) * -16px)`;
  // Glare position
  const glareX = useMotionTemplate`${useSpring(mouseX, { damping: 20, stiffness: 200 })} * 100%`;
  const glareY = useMotionTemplate`${useSpring(mouseY, { damping: 20, stiffness: 200 })} * 100%`;

  const currentCartQty = cartItems.find(i => i.selectedPortion === selectedPortion)?.qty || 0;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-[#121212] border border-neutral-800 rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center shadow-xl hover:border-[#DFB15B]/50 transition-colors duration-500 group overflow-hidden h-full"
    >
      {/* Glare overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          backgroundImage: useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(223,177,91,0.08) 0%, transparent 60%)`,
        }}
      />

      {/* Diet Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-[#1a1a1a]/80 backdrop-blur-sm px-2 py-1 rounded-md border border-neutral-800 shadow-sm">
        <div className={`w-3 h-3 border ${item.isVeg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center bg-white`}>
          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
        <span className="text-xs font-medium text-neutral-300">
          {item.isVeg ? 'Veg' : 'Non-Veg'}
        </span>
      </div>

      {/* Image container with subtle parallax */}
      <div className="relative w-36 h-36 sm:w-48 sm:h-48 mb-4 sm:mb-6 flex items-center justify-center overflow-hidden rounded-full border border-neutral-800 transform-gpu">
        <motion.div 
          className="w-full h-full relative flex items-center justify-center will-change-transform"
          style={{ x: translateX, y: translateY }}
        >
          <OptimizedImage 
            src={item.image} 
            alt={item.name} 
            fill
            sizes="(max-width: 640px) 144px, 192px"
            className="object-cover object-center scale-[1.2] drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] rounded-full" 
          />
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col items-center z-20 w-full">
        <h4 className="text-lg sm:text-xl font-serif text-white mb-2">{item.name}</h4>
        
        {/* Render portion prices */}
        <div className="flex flex-wrap justify-center gap-2 mb-4 mt-auto">
          {portionKeys.map((portion) => (
            <button 
              key={portion} 
              onClick={() => setSelectedPortion(portion)}
              className={`flex flex-col items-center px-3 py-1.5 rounded-lg border transition-all ${
                selectedPortion === portion 
                  ? 'bg-[#1a1a1a] border-[#DFB15B] shadow-[0_0_10px_rgba(223,177,91,0.2)]' 
                  : 'bg-transparent border-neutral-800 hover:border-neutral-600'
              }`}
            >
               <span className="text-neutral-400 text-xs mb-0.5">{portion}</span>
               <span className="text-[#DFB15B] font-bold text-sm">₹{item.prices[portion]}</span>
            </button>
          ))}
        </div>
        
        <div className="w-full mt-2">
          {currentCartQty > 0 ? (
            <div className="flex items-center justify-between bg-neutral-900 border border-[#DFB15B] rounded-lg p-1">
              <button
                onClick={() => onDecrease(item.id, selectedPortion)}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-neutral-800 rounded-md text-white hover:bg-red-500 hover:text-white transition-colors font-bold text-lg lg:cursor-none cursor-auto"
              >−</button>
              <span className="font-bold text-white text-base sm:text-lg">{currentCartQty}</span>
              <button
                onClick={() => onIncrease(item.id, selectedPortion)}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#DFB15B] rounded-md text-black hover:bg-[#F3A833] transition-colors font-bold text-lg lg:cursor-none cursor-auto"
              >+</button>
            </div>
          ) : (
            <MagneticButton
              onClick={() => onAdd({ ...item, selectedPortion })}
              className="w-full py-3 bg-neutral-800 text-white border border-[#DFB15B]/50 font-bold text-sm sm:text-base rounded-lg hover:bg-[#DFB15B] hover:text-black transition-colors lg:cursor-none cursor-auto shadow-[0_0_15px_rgba(223,177,91,0.1)]"
            >
              ADD TO ORDER
            </MagneticButton>
          )}
        </div>
      </div>
    </div>
  );
}
