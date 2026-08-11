'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLenis } from '@studio-freight/react-lenis';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const lenis = useLenis();

  const navLinks = [
    ['Home', '#home'],
    ['Our Menu', '#menu-section'], // Changed to #menu-section because #menu might not match the container properly
    ['Ambiance', '#ambience'],
    ['Contact', '#contact']
  ];

  useEffect(() => {
    const sections = ['home', 'menu-section', 'ambience', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileNavOpen(false);
    const targetId = href.replace('#', '');

    if (lenis) {
      lenis.scrollTo(`#${targetId}`, { offset: -90 });
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: targetId === 'home' ? 0 : offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  const baseLinkClass = "relative py-2 uppercase tracking-[0.2em] text-xs font-medium transition-all duration-300";
  const inactiveLinkClass = "text-[#C4B5A5] hover:text-[#F5F2EB]";
  const activeLinkClass = "text-[#F5F2EB]";

  const underlineClass = "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-[#DFB15B] after:origin-center after:transition-transform after:duration-300 after:ease-out";
  const inactiveUnderlineClass = "after:scale-x-0 hover:after:scale-x-100";
  const activeUnderlineClass = "after:scale-x-100";

  return (
    <>
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-[#0B0B0C]/98 backdrop-blur-md z-[200] flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="absolute top-4 right-4 text-[#DFB15B] text-3xl font-bold p-4"
              aria-label="Close menu"
            >✕</button>
            {navLinks.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={(e) => handleClick(e, href)}
                className={`text-xl font-serif tracking-[0.2em] uppercase px-8 py-4 border border-[#DFB15B]/10 hover:border-[#DFB15B] bg-neutral-900/40 min-w-[260px] text-center relative group transition-colors duration-300 ${
                  activeSection === href.replace('#', '') ? 'text-[#F5F2EB] border-[#DFB15B]/50' : 'text-[#C4B5A5]'
                }`}
              >
                <span className="absolute top-0 left-0 w-3 h-[1px] bg-[#DFB15B]/40 group-hover:w-full transition-all duration-300" />
                <span className="absolute bottom-0 right-0 w-3 h-[1px] bg-[#DFB15B]/40 group-hover:w-full transition-all duration-300" />
                <span className="absolute top-0 left-0 w-[1px] h-3 bg-[#DFB15B]/40 group-hover:h-full transition-all duration-300" />
                <span className="absolute bottom-0 right-0 w-[1px] h-3 bg-[#DFB15B]/40 group-hover:h-full transition-all duration-300" />
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="w-full px-3 sm:px-4 md:px-8 py-3 flex justify-between items-center gap-2 border-b border-neutral-800 bg-[#0B0B0C]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative h-9 w-9 sm:h-11 sm:w-11 rounded-full border-2 border-[#DFB15B] shrink-0 overflow-hidden bg-white">
            <Image src="/brand/logo.png" alt="Aroma Logo" fill className="object-contain" sizes="44px" />
          </div>
          <h1 className="text-base sm:text-lg md:text-xl font-serif font-bold text-[#DFB15B] tracking-widest uppercase truncate">Aroma Fine Dine</h1>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium">
          {navLinks.map(([label, href]) => {
            const isLinkActive = activeSection === href.replace('#', '');
            return (
              <a 
                key={label} 
                href={href} 
                onClick={(e) => handleClick(e, href)}
                className={`${baseLinkClass} ${
                  isLinkActive ? activeLinkClass : inactiveLinkClass
                } ${underlineClass} ${
                  isLinkActive ? activeUnderlineClass : inactiveUnderlineClass
                }`}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            className="bg-neutral-800 px-3 sm:px-5 py-2 rounded-lg text-[#DFB15B] font-bold text-sm border border-neutral-700 hover:border-[#DFB15B] transition-all flex items-center gap-1 sm:gap-2 shadow-[0_0_15px_rgba(223,177,91,0.1)] animate-pulse"
          >
            CART <span className="bg-[#DFB15B] text-black px-2 py-0.5 rounded-full text-xs animate-none">{cartCount}</span>
          </button>
          
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden flex flex-col gap-1.5 p-2 group"
            aria-label="Open menu"
          >
            <span className="block w-6 h-0.5 bg-[#DFB15B] rounded transition-all" />
            <span className="block w-4 h-0.5 bg-[#DFB15B] rounded transition-all group-hover:w-6" />
            <span className="block w-6 h-0.5 bg-[#DFB15B] rounded transition-all" />
          </button>
        </div>
      </header>
    </>
  );
}
export default Navbar;
