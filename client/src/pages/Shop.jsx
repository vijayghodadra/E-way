import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid, List, Sparkles, Filter, X } from 'lucide-react';
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-stone-200">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden bg-stone-100 px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-1.5"
          >
            <Filter className="w-4 h-4 text-primary" /> Filters
          </button>

          <span className="text-xs text-stone-500 font-medium">
            Showing <strong>{products.length}</strong> luxurious formulations
          </span>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium hidden sm:inline-block">Sort By:</span>
              <select
                value={selectedSort}
                onChange={handleSortChange}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
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
    </>
  );
};

export default Shop;
