import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchOpen } from '../store/slices/uiSlice';

const SearchModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSearchOpen } = useSelector((state) => state.ui);
  const [searchTerm, setSearchTerm] = useState('');

  const trendingTags = ['Kashmiri Saffron', 'Bhringraj Oil', 'Kumkumadi Serum', 'Rose Water', 'Jasmine Body Butter', 'Hyaluronic Gel'];

  if (!isSearchOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(setSearchOpen(false));
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleTagClick = (tag) => {
    dispatch(setSearchOpen(false));
    navigate(`/shop?search=${encodeURIComponent(tag)}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(setSearchOpen(false))}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-md"
        />

        {/* Floating Search Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 shadow-2xl z-10 border border-white/80"
        >
          <div className="flex items-center justify-between border-b border-stone-200/80 pb-4 mb-5">
            <div className="flex items-center gap-2 text-primary font-medium">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="font-playfair text-lg font-semibold">Search Botanical Remedies</span>
            </div>
            <button
              onClick={() => dispatch(setSearchOpen(false))}
              className="p-2 rounded-full hover:bg-stone-200/50 text-stone-500 hover:text-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ingredient, skin concern, or product..."
              autoFocus
              className="w-full bg-stone-100/90 text-text placeholder-stone-400 pl-12 pr-24 py-4 rounded-2xl text-base font-medium border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-dark transition-all flex items-center gap-1 shadow-md"
            >
              Search <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Suggestions */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 block">
              Trending Searches & Ingredients
            </span>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTagClick(tag)}
                  className="bg-white/80 hover:bg-primary hover:text-white border border-stone-200/80 text-stone-700 text-xs font-medium px-3.5 py-1.5 rounded-full transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-accent" /> {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SearchModal;
