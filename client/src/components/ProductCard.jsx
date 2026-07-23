import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingBag, Star, Sparkles, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { setQuickViewProduct } from '../store/slices/uiSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.title} added to cart!`, {
      style: {
        background: '#14532D',
        color: '#FFFFFF',
        borderRadius: '16px',
        fontSize: '13px',
        fontWeight: '500'
      },
      icon: '🌿'
    });
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    if (isWishlisted) {
      toast('Removed from Wishlist', { icon: '💔' });
    } else {
      toast.success('Saved to Wishlist!', { icon: '💖' });
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setQuickViewProduct(product));
  };

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountAmount = hasDiscount ? product.price - product.discountPrice : 0;
  const discountPercent = hasDiscount ? Math.round((discountAmount / product.price) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="group relative bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-stone-200/80 hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-secondary mb-3">
        <Link to={`/product/${product.slug || product._id}`}>
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1608248597560-8438b4562c55?auto=format&fit=crop&q=80&w=800'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {product.images?.[1] && (
            <img
              src={product.images[1]}
              alt={`${product.title} hover`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </Link>

        {/* Top Badges (Mint Green Pills) */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10 pointer-events-none max-w-[80%]">
          {hasDiscount && (
            <span className="bg-[#e0f2f1] text-[#00695c] font-semibold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-sm">
              Save ₹{discountAmount}
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#e0f2f1] text-[#004d40] font-bold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-sm uppercase">
              BEST SELLER
            </span>
          )}
        </div>

        {/* Wishlist Action Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-stone-700 hover:text-rose-500 shadow-sm hover:scale-110 transition-all z-10"
          title="Add to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Floating Overlay Button */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10 hidden sm:flex gap-2">
          <button
            onClick={handleQuickView}
            className="flex-1 bg-white/90 backdrop-blur-md text-stone-800 text-xs font-semibold py-2 rounded-xl hover:bg-stone-900 hover:text-white transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Title */}
          <Link to={`/product/${product.slug || product._id}`}>
            <h3 className="font-playfair text-xs sm:text-base font-semibold text-text group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-1">
              {product.title}
            </h3>
          </Link>

          {/* Subtitle / Key Benefit */}
          {product.subtitle && (
            <p className="text-[#00796b] text-[10px] sm:text-xs font-medium line-clamp-1 mb-1.5">
              {product.subtitle}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 text-amber-500 font-bold text-[10px] sm:text-xs mb-2">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating || 4.8}</span>
            <span className="text-stone-400 font-normal">({product.numReviews || 128})</span>
          </div>

          {/* Variant Tag Pill */}
          <div className="mb-2">
            <span className="border border-emerald-600/40 text-emerald-800 font-medium text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full inline-block">
              {product.volume || 'Pure Organic Formula'}
            </span>
          </div>
        </div>

        {/* Price & Add Button Row */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-1 gap-1">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="border border-stone-800 rounded-full px-2 sm:px-2.5 py-0.5 text-xs sm:text-sm font-bold text-stone-900">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-[#2e7d32] text-white hover:bg-emerald-800 font-bold text-xs px-3 sm:px-4 py-1.5 rounded-full transition-all shadow-sm flex items-center justify-center gap-1"
          >
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
