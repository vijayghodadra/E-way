import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';

const testimonials = [
  {
    quote: "The Golden Saffron Elixir completely transformed my stubborn dark spots in 3 weeks. It feels like absolute luxury liquid gold on my skin!",
    author: "Dr. Radhika Roy",
    role: "Dermatology Consultant",
    rating: 5,
    product: "Golden Saffron Night Elixir"
  },
  {
    quote: "The Rose Dew Nectar smells heavenly and gives me an effortless glass-skin glow without feeling heavy under makeup. Truly botanical mastery.",
    author: "Meera Kapoor",
    role: "Beauty Editor, Vogue Luxe",
    rating: 5,
    product: "Rose Dew Nectar Hydra-Gel"
  },
  {
    quote: "The Bhringraj scalp oil rescued my postpartum hair loss. The hair feels thicker, shinier and healthier. Highest quality botanical oil I have ever used.",
    author: "Ananya Sharma",
    role: "Verified Purchaser",
    rating: 5,
    product: "Herbal Bhringraj Scalp Elixir"
  },
  {
    quote: "This deep forest sandalwood cleanser leaves my skin incredibly soft, hydrated, and smelling like divine fresh-cut wood. Absolute sensory bliss!",
    author: "Rohan Mehta",
    role: "Style Advisor & Aesthetician",
    rating: 5,
    product: "Sandalwood Cleansing Nectar"
  },
  {
    quote: "The Cold-Pressed Moringa Oil revitalized my dehydrated skin overnight. It's lightweight, non-comedogenic, and pure alchemical magic!",
    author: "Priyanjali Sen",
    role: "Wellness & Clean Beauty Blogger",
    rating: 5,
    product: "Moringa Cold-Pressed Oil"
  }
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      opacity: { duration: 0.35 },
      scale: { duration: 0.35 }
    }
  },
  exit: (direction) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.97,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      opacity: { duration: 0.3 },
      scale: { duration: 0.3 }
    }
  })
};

const TestimonialSlider = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const autoplayTimer = useRef(null);

  const activeIndex = (page % testimonials.length + testimonials.length) % testimonials.length;

  const navigate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleNext = () => navigate(1);
  const handlePrev = () => navigate(-1);

  // Autoplay function (2.5 seconds loop)
  useEffect(() => {
    if (isPlaying) {
      autoplayTimer.current = setInterval(() => {
        handleNext();
      }, 2500);
    }
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [isPlaying, page]);

  // Drag handler for mobile gestures
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold) {
      navigate(1);
    } else if (info.offset.x > swipeThreshold) {
      navigate(-1);
    }
  };

  const currentTestimonial = testimonials[activeIndex];

  return (
    <div className="relative max-w-2xl mx-auto px-3 py-4">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-700/5 rounded-full blur-[60px] pointer-events-none z-0" />
      
      {/* Card Slider Window */}
      <div 
        className="relative min-h-[220px] sm:min-h-[190px] w-full flex items-center justify-center overflow-hidden py-4 z-10"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            whileTap={{ cursor: 'grabbing' }}
            className="w-full bg-white/70 backdrop-blur-md rounded-2xl border border-stone-200/70 shadow-[0_8px_16px_rgba(0,0,0,0.01),0_2px_6px_rgba(0,0,0,0.01)] hover:shadow-md p-5 sm:p-7 cursor-grab relative select-none flex flex-col justify-between"
          >
            {/* Elegant Translucent Quote Icon */}
            <div className="absolute top-4 right-5 text-stone-200/35 pointer-events-none">
              <Quote className="w-8 h-8 fill-stone-100" />
            </div>

            {/* Testimonial Core Content */}
            <div className="space-y-3">
              {/* Product Badge & Stars */}
              <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-900/5 border border-emerald-800/10 text-[9px] font-semibold tracking-wider text-emerald-905 uppercase">
                  <Sparkles className="w-2.5 h-2.5 text-accent" /> {currentTestimonial.product}
                </span>
                
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Quote Text */}
              <p className="font-playfair text-sm sm:text-base italic text-stone-850 leading-relaxed font-medium">
                "{currentTestimonial.quote}"
              </p>
            </div>

            {/* Author details */}
            <div className="mt-5 pt-2.5 border-t border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="font-playfair text-xs sm:text-sm font-extrabold text-stone-900">
                  {currentTestimonial.author}
                </h4>
                <p className="text-[10px] text-stone-500 font-light tracking-wide mt-0.5">
                  {currentTestimonial.role}
                </p>
              </div>

              <div className="hidden sm:flex text-emerald-900/15 pointer-events-none items-center gap-1 text-[9px] font-semibold tracking-widest uppercase">
                swipe to scroll
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls (Mobile Friendly Row) */}
      <div className="mt-3 flex items-center justify-between gap-4 px-1">
        {/* Pagination Dots */}
        <div className="flex items-center gap-1.5">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                const diff = idx - activeIndex;
                if (diff !== 0) {
                  setPage([page + diff, diff]);
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx 
                  ? 'w-5 bg-emerald-900' 
                  : 'w-1.5 bg-stone-300 hover:bg-stone-400'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Action Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-white hover:bg-emerald-900 border border-stone-200/80 hover:border-emerald-900 hover:text-white text-stone-700 flex items-center justify-center transition-all duration-350 shadow-xs hover:shadow-sm"
            title="Previous Review"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-white hover:bg-emerald-900 border border-stone-200/80 hover:border-emerald-900 hover:text-white text-stone-700 flex items-center justify-center transition-all duration-350 shadow-xs hover:shadow-sm"
            title="Next Review"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
