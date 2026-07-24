import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid, List, Sparkles, Filter, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { fetchProductsAPI, fetchCategoriesAPI } from '../api/queries';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const searchKeyword = searchParams.get('search') || '';
  const selectedSort = searchParams.get('sort') || 'newest';

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedRating, setSelectedRating] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const loadShopData = async () => {
      setLoading(true);
      try {
        const [prodData, catData] = await Promise.all([
          fetchProductsAPI({
            category: selectedCategory,
            search: searchKeyword,
            sort: selectedSort,
            minPrice: minPrice > 0 ? minPrice : undefined,
            maxPrice: maxPrice < 5000 ? maxPrice : undefined,
            rating: selectedRating || undefined
          }),
          fetchCategoriesAPI()
        ]);
        setProducts(prodData.products || []);
        setCategories(catData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadShopData();
  }, [selectedCategory, searchKeyword, selectedSort, minPrice, maxPrice, selectedRating]);

  const handleCategorySelect = (catSlug) => {
    if (catSlug === selectedCategory) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catSlug);
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (e) => {
    searchParams.set('sort', e.target.value);
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setMinPrice(0);
    setMaxPrice(5000);
    setSelectedRating('');
    setSearchParams({});
  };

  return (
    <>
      <SEO
        title="Botanical Collection | Élixir Store"
        description="Explore our full collection of bio-active serums, organic oils, and hair growth remedies."
      />

      {/* Header Banner */}
      <div className="bg-secondary py-12 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <span className="text-xs font-semibold tracking-widest text-primary uppercase mb-2 block">
            Pure Clean Beauty
          </span>
          <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-text mb-3">
            {selectedCategory ? categories.find((c) => c.slug === selectedCategory)?.name || 'Botanical Remedies' : searchKeyword ? `Search: "${searchKeyword}"` : 'All Botanical Remedies'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light">
            Formulated without synthetic chemicals, artificial colors, or parabens. Pure efficacy in every drop.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls Bar (Filter Button, Product Count, Sort Dropdown) */}
        <div className="bg-stone-50/80 border border-stone-200/80 rounded-2xl p-3.5 sm:p-4 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            {/* Top row on Mobile / Left side on Desktop */}
            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden bg-white hover:bg-stone-100 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-800 flex items-center gap-2 transition-all border border-stone-200/80 shadow-xs shrink-0"
              >
                <Filter className="w-3.5 h-3.5 text-primary" />
                <span>Filters</span>
                {(selectedCategory || searchKeyword || minPrice > 0 || selectedRating) && (
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                )}
              </button>

              <span className="text-xs text-stone-600 font-medium hidden sm:block">
                Showing <strong className="text-stone-900 font-semibold">{products.length}</strong> {products.length === 1 ? 'formulation' : 'formulations'}
              </span>

              {/* Sort Dropdown for Mobile (Top-Right on Mobile) */}
              <div className="flex sm:hidden items-center gap-1.5">
                <select
                  value={selectedSort}
                  onChange={handleSortChange}
                  className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-xs cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Bottom row on Mobile / Right side on Desktop */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t border-stone-200/60 pt-2.5 sm:pt-0 sm:border-t-0">
              <span className="text-xs text-stone-600 font-medium sm:hidden block">
                Showing <strong className="text-stone-900 font-semibold">{products.length}</strong> {products.length === 1 ? 'formulation' : 'formulations'}
              </span>

              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-stone-500 font-medium whitespace-nowrap">Sort By:</span>
                <select
                  value={selectedSort}
                  onChange={handleSortChange}
                  className="bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-xs cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-8 pr-6 border-r border-stone-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-playfair text-base font-semibold text-text flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" /> Filter Remedies
              </h3>
              {(selectedCategory || searchKeyword || minPrice > 0 || selectedRating) && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-semibold text-rose-600 hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Categories filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                Categories
              </h4>
              <ul className="space-y-2 text-xs text-stone-600 font-medium">
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <button
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`w-full text-left py-1 flex items-center justify-between hover:text-primary transition-colors ${
                        selectedCategory === cat.slug ? 'text-primary font-bold' : ''
                      }`}
                    >
                      <span>{cat.name}</span>
                      {selectedCategory === cat.slug && (
                        <Sparkles className="w-3 h-3 text-accent" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                Price Range (₹)
              </h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
                  <span>₹0</span>
                  <span>Up to ₹{maxPrice}</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                Customer Rating
              </h4>
              <div className="space-y-2 text-xs text-stone-600 font-medium">
                {['4.5', '4.0', '3.5'].map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="ratingFilter"
                      checked={selectedRating === r}
                      onChange={() => setSelectedRating(r)}
                      className="accent-primary"
                    />
                    <span>{r} Stars & Above</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-stone-100 rounded-3xl h-80" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-stone-50 rounded-3xl border border-stone-200">
                <h3 className="font-playfair text-xl font-semibold text-text mb-2">
                  No botanical formulations found
                </h3>
                <p className="text-xs text-muted max-w-sm mx-auto mb-6">
                  Try adjusting your search criteria or resetting filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-primary text-white text-xs font-semibold px-6 py-3 rounded-2xl"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'linear' }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-stone-950/60"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              style={{ willChange: 'transform' }}
              className="relative w-[82%] max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10 overflow-y-auto transform-gpu"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
                  <h3 className="font-playfair text-base font-bold text-stone-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" /> Filter Remedies
                  </h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Categories</h4>
                  <ul className="space-y-1.5 text-xs font-medium text-stone-700">
                    {categories.map((cat) => (
                      <li key={cat._id}>
                        <button
                          onClick={() => {
                            handleCategorySelect(cat.slug);
                            setMobileFilterOpen(false);
                          }}
                          className={`w-full text-left py-2 px-3 rounded-xl flex items-center justify-between transition-colors ${
                            selectedCategory === cat.slug ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-stone-100'
                          }`}
                        >
                          <span>{cat.name}</span>
                          {selectedCategory === cat.slug && <Sparkles className="w-3.5 h-3.5 text-accent" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Price Range</h4>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mt-2">
                    <span>₹0</span>
                    <span>Up to ₹{maxPrice}</span>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Customer Rating</h4>
                  <div className="space-y-2 text-xs text-stone-700 font-medium">
                    {['4.5', '4.0', '3.5'].map((r) => (
                      <label key={r} className="flex items-center gap-2 cursor-pointer py-1">
                        <input
                          type="radio"
                          name="mobileRatingFilter"
                          checked={selectedRating === r}
                          onChange={() => {
                            setSelectedRating(r);
                            setMobileFilterOpen(false);
                          }}
                          className="accent-primary"
                        />
                        <span>{r} Stars & Above</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <button
                  onClick={() => {
                    clearAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full bg-stone-100 text-stone-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-stone-200 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Shop;
