import React from 'react';
import { Sparkles, Leaf, ShieldCheck, Award } from 'lucide-react';
import SEO from '../components/SEO';

const About = () => {
  return (
    <>
      <SEO title="Our Heritage & Philosophy | Élixir Botanicals" />

      <div className="bg-secondary py-16 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="champagne-badge text-xs px-3.5 py-1 rounded-full font-semibold uppercase tracking-wider inline-flex items-center gap-1 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Est. 2026
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-text mb-4">
            The Élixir Botanicals Legacy
          </h1>
          <p className="text-stone-500 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
            Harnessing 5,000-year-old Ayurvedic extractions combined with contemporary bio-active green chemistry.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 text-stone-700 text-sm leading-relaxed font-light">
            <h2 className="font-playfair text-2xl font-bold text-text">Pure Cold-Cooked Alchemy</h2>
            <p>
              Founded with the vision to create non-toxic, potent skincare solutions, Élixir Botanicals source wild Kashmiri Saffron, organic Bhringraj, and Mysore Sandalwood directly from sustainable fair-trade farmers.
            </p>
            <p>
              Every batch is slow-infused in small copper caldrons for 21 days to preserve delicate vitamins, essential fatty acids, and natural antioxidants.
            </p>
          </div>
          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury border border-stone-200">
            <img
              src="https://images.unsplash.com/photo-1608248597560-8438b4562c55?auto=format&fit=crop&q=80&w=800"
              alt="Ayurvedic Extraction"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
