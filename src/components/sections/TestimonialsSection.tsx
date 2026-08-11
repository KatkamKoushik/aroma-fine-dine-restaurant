import React from 'react';

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Elegant ambience with the best window view in town.",
      author: "Local Guide",
      rating: 5
    },
    {
      quote: "Excellent hospitality. We loved the 5-in-1 special items!",
      author: "Food Enthusiast",
      rating: 5
    },
    {
      quote: "They made my birthday celebration so special with perfect arrangements. Highly recommended!",
      author: "Happy Customer",
      rating: 5
    }
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-transparent border-t border-[#1A1A1A]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#DFB15B] text-xs sm:text-sm tracking-[0.4em] uppercase font-bold mb-4">Social Proof</p>
          <h2 className="text-3xl md:text-4xl font-cinzel text-white mb-4">What Our Guests Say</h2>
          <div className="w-12 h-[2px] bg-[#DFB15B] mx-auto mb-6" />
          <p className="text-neutral-400 font-light">
            Rated <span className="text-[#DFB15B] font-bold">4.7/5 Stars</span> based on 4,000+ reviews
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <div key={idx} className="bg-[#111112] p-8 rounded-lg border border-[#222] flex flex-col justify-between">
              <div>
                <div className="flex text-[#DFB15B] mb-4 text-xl">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-neutral-300 italic leading-relaxed mb-6">"{test.quote}"</p>
              </div>
              <p className="text-[#DFB15B] font-serif font-bold">— {test.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
