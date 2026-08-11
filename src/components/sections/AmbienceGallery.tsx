'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from '../ui/OptimizedImage';

const images = [
  { src: '/ambience/dinning.jpg', alt: 'Dining Area', span: 'md:col-span-2 md:row-span-2' },
  { src: '/ambience/outerview.jpg', alt: 'Outer View', span: 'md:col-span-1 md:row-span-1' },
  { src: '/ambience/aroma.jpg', alt: 'Restaurant Ambience', span: 'md:col-span-1 md:row-span-1' },
  { src: '/ambience/maybe entrance.jpg', alt: 'Entrance', span: 'md:col-span-2 md:row-span-1' },
];

export function AmbienceGallery() {
  return (
    <section id="ambience" className="w-full py-20 px-4 sm:px-6 md:px-12 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-[#DFB15B] font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-3 block">
            The Atmosphere
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white">
            Breathtaking Ambience
          </h2>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto font-sans">
            Immerse yourself in our beautifully crafted dining space, featuring elegant lighting, comfortable seating, and a warm, inviting atmosphere perfect for any occasion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative overflow-hidden rounded-2xl group ${img.span} h-64 md:h-auto`}
            >
              <OptimizedImage
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
