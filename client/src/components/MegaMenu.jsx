import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';

const MegaMenu = ({ isOpen, onClose, categories = [] }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onMouseLeave={onClose}
        className="absolute top-full left-0 w-full glass-panel border-t border-stone-200/60 shadow-luxury py-10 z-40"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-8 items-center">
          {/* Column 1: Featured Categories List */}
          <div className="col-span-4 border-r border-stone-200/50 pr-8">
            <h3 className="text-xs font-semibold tracking-widest text-primary uppercase mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" /> Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link
                    to={`/shop?category=${cat.slug}`}
                    onClick={onClose}
                    className="group flex items-center justify-between text-sm font-medium text-stone-700 hover:text-primary transition-colors py-1"
                  >
                    <span>{cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-amber-600 uppercase tracking-wider transition-colors"
                >
                  Explore All Products <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Best Sellers & Ritual Highlights (3 Clean Cards) */}
          <div className="col-span-8 pl-2">
            <h3 className="text-xs font-semibold tracking-widest text-primary uppercase mb-4 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-accent" /> Botanical Rituals
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <Link
                to="/shop?category=botanical-skincare"
                onClick={onClose}
                className="group relative overflow-hidden rounded-2xl bg-stone-50 p-3.5 border border-stone-200/70 hover:border-amber-400/40 hover:shadow-md transition-all"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-200">
                  <img
                    src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=400"
                    alt="Kumkumadi Ritual"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-playfair text-sm font-semibold text-stone-900 group-hover:text-primary">
                  Kumkumadi Ritual
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">24K Saffron Serum</p>
              </Link>

              <Link
                to="/shop?category=herbal-hair-care"
                onClick={onClose}
                className="group relative overflow-hidden rounded-2xl bg-stone-50 p-3.5 border border-stone-200/70 hover:border-amber-400/40 hover:shadow-md transition-all"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-200">
                  <img
                    src="https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=400"
                    alt="Bhringraj Scalp Therapy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-playfair text-sm font-semibold text-stone-900 group-hover:text-primary">
                  Bhringraj Therapy
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Intensive Scalp Oil</p>
              </Link>

              <Link
                to="/shop?category=artisanal-body-care"
                onClick={onClose}
                className="group relative overflow-hidden rounded-2xl bg-stone-50 p-3.5 border border-stone-200/70 hover:border-amber-400/40 hover:shadow-md transition-all"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-200">
                  <img
                    src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400"
                    alt="Jasmine Body Soufflé"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=400';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-playfair text-sm font-semibold text-stone-900 group-hover:text-primary">
                  Jasmine Soufflé
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Whipped Body Butter</p>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MegaMenu;
