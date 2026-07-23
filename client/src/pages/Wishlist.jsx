import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { clearWishlist } from '../store/slices/wishlistSlice';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  return (
    <>
      <SEO title="Saved Botanical Wishlist" />

      <div className="bg-secondary py-12 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-xs font-semibold tracking-widest text-primary uppercase mb-2 block">
            Saved Remedies
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-text">Your Wishlist</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-200">
            <Heart className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="font-playfair text-xl font-semibold text-text mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-muted max-w-xs mx-auto mb-6">
              Save your favorite luxury serums and botanical hair elixirs here.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-semibold text-stone-600">
                {items.length} Saved Formulations
              </span>
              <button
                onClick={() => dispatch(clearWishlist())}
                className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Wishlist
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
