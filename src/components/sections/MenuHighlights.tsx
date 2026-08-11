import React from 'react';
import { motion } from 'framer-motion';
import { MenuCard } from '../ui/MenuCard';
import { CartItem, MenuItem } from '@/types';

interface MenuHighlightsProps {
  cart: CartItem[];
  items: MenuItem[];
  onIncrease: (id: string, portion: string) => void;
  onDecrease: (id: string, portion: string) => void;
  onAdd: (item: Omit<CartItem, 'qty'>) => void;
}

export function MenuHighlights({ cart, items, onIncrease, onDecrease, onAdd }: MenuHighlightsProps) {
  // Select signature dishes based on IDs or names
  const highlightIds = ["aroma-1", "aroma-2", "aroma-3", "aroma-4"];
  const highlightedItems = items.filter(item => highlightIds.includes(item.id));

  if (highlightedItems.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 md:px-12 bg-transparent">
      <div className="text-center mb-12">
        <p className="text-[#DFB15B] text-xs sm:text-sm tracking-[0.4em] uppercase font-bold mb-4">Chef's Recommendations</p>
        <h3 className="text-3xl sm:text-4xl font-serif text-white">Signature Dishes</h3>
        <div className="w-12 h-[2px] bg-[#DFB15B] mx-auto mt-6" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 xl:gap-10">
        {highlightedItems.map((item, idx) => {
          const cartItemsForItem = cart.filter(i => i.id === item.id);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <MenuCard
                item={item}
                cartItems={cartItemsForItem}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onAdd={onAdd}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
