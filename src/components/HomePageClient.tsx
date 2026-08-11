'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Navbar } from '@/components/layout/Navbar';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { MenuGrid } from '@/components/sections/MenuGrid';
import { MenuHighlights } from '@/components/sections/MenuHighlights';
import { AromaHero } from '@/components/sections/AromaHero';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { AmbienceGallery } from './sections/AmbienceGallery';
import { BanquetHallSection } from './sections/BanquetHallSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { BirthdayPromoModal } from '@/components/ui/BirthdayPromoModal';
import { CartItem, MenuItem } from '@/types';

export function HomePageClient({ initialMenuItems }: { initialMenuItems: MenuItem[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "menuItems"));
        const items: MenuItem[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const rawName = data.name || "";
          const rawCategory = data.category || "";
          let correctedCategory = rawCategory;
          const n = rawName.toLowerCase();
          const c = rawCategory.toLowerCase();
          
          // Rescue misplaced items that ended up in Drinks/Desserts
          if (c.includes('beverage') || c.includes('mocktail') || c.includes('dessert') || c.includes('shake')) {
            if (n.includes('chicken') || n.includes('murgh')) correctedCategory = 'Chicken';
            else if (n.includes('mutton') || n.includes('gosht') || n.includes('keema')) correctedCategory = 'Mutton';
            else if (n.includes('egg')) correctedCategory = 'Egg';
            else if (n.includes('fish') || n.includes('prawn')) correctedCategory = 'Seafood';
            else if (n.includes('soup')) correctedCategory = 'Soups';
            else if (n.includes('paneer') || n.includes('mushroom') || n.includes('manchurian')) correctedCategory = 'Starters';
            else if (n.includes('rice') || n.includes('noodle') || n.includes('biryani')) correctedCategory = 'Rice & Noodles';
          }

          items.push({
            id: doc.id,
            name: rawName,
            description: data.description,
            prices: data.prices || { Regular: 0 },
            category: correctedCategory,
            image: data.image_url,
            isVeg: typeof data.isVeg === 'boolean' 
              ? data.isVeg 
              : !(/chicken|mutton|egg|fish|prawn|gosht|murgh|kheema|keema|non-veg/i.test(n + " " + c)),
          } as MenuItem);
        });
        // We might need to sort them or just set them
        if (items.length > 0) {
          setMenuItems(items);
        } else {
          console.log("Firebase is empty, using fallback menu.");
        }
      } catch (error) {
        console.error("Failed to fetch menu from Firebase:", error);
      }
    };
    fetchMenuItems();
  }, []);

  // Cart Functions
  const addToCart = (item: Omit<CartItem, 'qty'>) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id && i.selectedPortion === item.selectedPortion);
      if (exists) return prev.map(i => (i.id === item.id && i.selectedPortion === item.selectedPortion) ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const increaseQty = (id: string, portion: string) => {
    setCart(prev => prev.map(i => (i.id === id && i.selectedPortion === portion) ? { ...i, qty: i.qty + 1 } : i));
  };

  const decreaseQty = (id: string, portion: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id && i.selectedPortion === portion);
      if (existing && existing.qty === 1) {
        return prev.filter(i => !(i.id === id && i.selectedPortion === portion));
      }
      return prev.map(i => 
        (i.id === id && i.selectedPortion === portion) 
          ? { ...i, qty: i.qty - 1 } 
          : i
      );
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <main className="min-h-screen bg-transparent text-white font-sans overflow-clip relative selection:bg-[#DFB15B] selection:text-[#0A0A0B]">
      <div id="home" className="absolute top-0 left-0 w-full h-[1px] pointer-events-none" />
      <BirthdayPromoModal />


      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
      />

      <AromaHero />
      <FeaturesSection />

      <div id="menu-section">
        
        <MenuGrid 
          cart={cart} 
          items={menuItems}
          onIncrease={increaseQty} 
          onDecrease={decreaseQty} 
          onAdd={addToCart} 
        />
      </div>

      <AmbienceGallery />
      <BanquetHallSection />
      <TestimonialsSection />



      {/* ═══════════════ FOOTER & CONTACT ═══════════════ */}
      <div id="contact" className="w-full mt-20">
        {/* Golden Divider Line */}
        <div className="w-full h-[1px] bg-[#C5A059]/40 relative z-30" />
        <footer className="relative overflow-hidden w-full py-16 px-4 sm:px-8 bg-transparent">
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

          <div className="relative z-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side: Contact Info & Tagline */}
            <div className="flex flex-col gap-6 text-center md:text-left">
              <h2 className="font-cinzel text-white text-3xl sm:text-4xl md:text-5xl tracking-widest text-[#DFB15B]">
                AROMA
              </h2>
              <p className="font-serif text-lg italic text-neutral-300">
                "Eat like never before"
              </p>
              
              <div className="flex flex-col gap-2 text-sm text-neutral-400 font-sans mt-4">
                <p>2nd Floor, Lopamudra Arcade Mall</p>
                <p>Above Reliance Trends, Lashkar Singaram</p>
                <p>Naim Nagar, Hanamkonda, Warangal, Telangana 506009</p>
                <p className="mt-2 text-white">+91 73311 22436 / +91 73311 22437</p>
              </div>

              <div className="mt-6 flex justify-center md:justify-start">
                <a 
                  href="https://www.instagram.com/aromarestaurant_hanamkonda?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-white hover:text-[#DFB15B] transition-colors bg-neutral-900 px-6 py-3 rounded-full border border-neutral-800 hover:border-[#DFB15B]"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-sm tracking-wider">@aromarestaurant_hanamkonda</span>
                </a>
              </div>
            </div>

            {/* Right Side: Google Maps Embed */}
            <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden border-2 border-neutral-800 shadow-2xl relative group">
              <div className="absolute inset-0 bg-[#DFB15B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.4473217194272!2d79.55099587495016!3d18.016839082981697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a334f01da2cb9ab%3A0x3c7cff4d085aeb97!2sAROMA%20FINE%20DINE%20RESTAURANT%20%26%20BANQUET%20HALL!5e1!3m2!1sen!2sin!4v1786455863789!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
