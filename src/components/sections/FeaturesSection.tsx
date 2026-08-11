import React from 'react';

export function FeaturesSection() {
  const features = [
    {
      title: "Dining Modes",
      description: "Dine-in, Takeaway, and Doorstep Delivery.",
      icon: "🍽️"
    },
    {
      title: "Delivery Partners",
      description: "Listed on Swiggy, Zomato, and Fuddo for your convenience.",
      icon: "🛵"
    },
    {
      title: "Payment Methods",
      description: "We accept Credit Cards, Debit Cards, and NFC Mobile Payments.",
      icon: "💳"
    }
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-transparent border-y border-[#1A1A1A]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-cinzel text-white mb-4">Our Services</h2>
          <div className="w-12 h-[2px] bg-[#DFB15B] mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-[#111112] p-8 rounded-lg border border-[#222] text-center hover:border-[#DFB15B]/50 transition-colors duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-serif text-[#DFB15B] mb-3">{feature.title}</h3>
              <p className="text-neutral-400 font-light leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
