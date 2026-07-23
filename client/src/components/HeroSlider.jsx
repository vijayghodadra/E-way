import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Heart } from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    tag: 'NEW LAUNCH',
    title: 'THE MAIN CHARACTER',
    subtitle: 'For Every Story • 3 Fragrances Inspired by Different Versions of You',
    details: 'PARABEN FREE • LONG LASTING • IFRA COMPLIANT',
    badge: '100% ORGANIC ESSENCE',
    image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'Shop New Fragrance',
    ctaLink: '/shop?category=aromatherapy-wellness',
    bgGradient: 'from-amber-950/90 via-stone-950/70 to-stone-950/40'
  },
  {
    id: 2,
    tag: 'BEST SELLER',
    title: 'SACRED KASHMIRI SAFFRON',
    subtitle: 'Cold-Infused 24K Kumkumadi Youth Radiance Night Elixir',
    details: '26 ANCIENT AYURVEDIC HERBS • 100% COLD PRESSED',
    badge: 'DERMATOLOGICALLY TESTED',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'Discover Kumkumadi Ritual',
    ctaLink: '/shop?category=botanical-skincare',
    bgGradient: 'from-emerald-950/90 via-stone-950/70 to-stone-950/40'
  },
  {
    id: 3,
    tag: 'EXCLUSIVE RITUAL',
    title: 'KANNAUJ STEAM-DISTILLED ROSE',
    subtitle: 'Hydrating Plant Hyaluronic Dew Drops Hydra-Gel',
    details: '48H PLUMPING HYDRATION • NON-COMEDOGENIC',
    badge: 'FRESH FLOWER DISTILLATION',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'Explore Dew Collection',
    ctaLink: '/shop?category=botanical-skincare',
    bgGradient: 'from-rose-950/90 via-stone-950/70 to-stone-950/40'
  },
  {
    id: 4,
    tag: 'INTENSIVE HAIR CARE',
    title: 'HERBAL BHRINGRAJ ELIXIR',
    subtitle: 'Ayurvedic Scalp Growth & Hair Density Therapy',
    details: 'SLOW COOKED FOR 21 DAYS • 85% HAIR FALL REDUCTION',
    badge: 'TRADITIONAL BRASS CALDRON EXTRACTION',
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'Discover Hair Growth Remedy',
    ctaLink: '/shop?category=herbal-hair-care',
    bgGradient: 'from-stone-950/95 via-stone-900/80 to-transparent'
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  // Auto-scroll every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setCurrent((prev) => (prev + 1) % heroSlides.length);
  const handlePrev = () => setCurrent((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));

  const slide = heroSlides[current];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Containerized Card Banner Slider */}
      <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl bg-stone-900 min-h-[360px] sm:min-h-[460px] flex items-center border border-stone-200/40">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute inset-0 z-0"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover opacity-60 sm:opacity-75"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient}`} />
          </motion.div>
        </AnimatePresence>

        {/* Diagonal Corner Ribbon / Badge */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
          <span className="bg-amber-400 text-stone-950 font-extrabold text-[10px] sm:text-xs px-3.5 py-1.5 rounded-full uppercase tracking-widest shadow-md flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-stone-950" /> {slide.tag}
          </span>
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-10 text-white space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="space-y-3 sm:space-y-4"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold text-amber-200 border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" /> {slide.badge}
              </div>

              <h1 className="font-playfair text-2xl sm:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
                {slide.title}
              </h1>

              <p className="text-stone-200 text-xs sm:text-base font-medium max-w-lg leading-relaxed">
                {slide.subtitle}
              </p>

              <p className="text-[10px] sm:text-xs font-bold text-accent tracking-widest uppercase pt-1">
                {slide.details}
              </p>

              <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3">
                <Link
                  to={slide.ctaLink}
                  className="bg-primary text-white hover:bg-primary-dark font-semibold text-xs sm:text-sm px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl shadow-luxury flex items-center gap-2 group transition-all"
                >
                  {slide.ctaText}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Navigation Arrows & Indicators */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-20 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-stone-900/60 backdrop-blur-md hover:bg-accent hover:text-stone-950 text-white flex items-center justify-center transition-all border border-white/20"
              title="Previous Banner"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-stone-900/60 backdrop-blur-md hover:bg-accent hover:text-stone-950 text-white flex items-center justify-center transition-all border border-white/20"
              title="Next Banner"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {heroSlides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  current === idx ? 'w-6 bg-accent' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
