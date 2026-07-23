import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setQuickViewProduct } from '../store/slices/uiSlice';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

const QuickViewModal = () => {
  const dispatch = useDispatch();
  const { quickViewProduct: product } = useSelector((state) => state.ui);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) return null;

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    toast.success(`${product.title} added to cart!`, { icon: '🌿' });
    dispatch(setQuickViewProduct(null));
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product));
    if (isWishlisted) {
      toast('Removed from Wishlist', { icon: '💔' });
    } else {
      toast.success('Saved to Wishlist!', { icon: '💖' });
    }
  };

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(setQuickViewProduct(null))}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-y-auto shadow-2xl z-10 border border-stone-200 grid grid-cols-1 md:grid-cols-2 p-6 md:p-8 gap-8"
        >
          {/* Close button */}
          <button
            onClick={() => dispatch(setQuickViewProduct(null))}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors z-20"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left: Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === idx ? 'border-primary scale-105' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                <span>{product.category?.name || 'Botanical Remedy'}</span>
                <span>•</span>
                <span className="text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {product.rating || 4.9}
                </span>
              </div>

              <h2 className="font-playfair text-2xl font-bold text-text leading-tight mb-2">
                {product.title}
              </h2>
              {product.subtitle && (
                <p className="text-xs text-stone-500 font-medium mb-4">{product.subtitle}</p>
              )}

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl font-bold text-primary">
                  ₹{displayPrice?.toLocaleString('en-IN')}
                </span>
                {product.discountPrice > 0 && (
                  <span className="text-sm text-stone-400 line-through">
                    ₹{product.price?.toLocaleString('en-IN')}
                  </span>
                )}
                {product.volume && (
                  <span className="text-xs text-stone-500 font-medium bg-stone-100 px-2.5 py-1 rounded-full">
                    {product.volume}
                  </span>
                )}
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-stone-200 gap-6 text-xs font-semibold mb-4">
                {['description', 'ingredients', 'benefits'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 capitalize transition-colors ${
                      activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="text-xs text-stone-600 leading-relaxed min-h-[90px] mb-6">
                {activeTab === 'description' && <p>{product.description}</p>}
                {activeTab === 'ingredients' && (
                  <ul className="space-y-1">
                    {product.ingredients?.map((ing, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> {ing}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 'benefits' && (
                  <ul className="space-y-1">
                    {product.benefits?.map((ben, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-accent" /> {ben}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-stone-600 hover:text-primary font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-stone-600 hover:text-primary font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-white text-xs font-semibold py-3.5 rounded-2xl hover:bg-primary-dark transition-all shadow-luxury flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className="p-3 rounded-2xl border border-stone-200 hover:border-rose-400 hover:text-rose-500 text-stone-600 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 font-medium pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" /> 100% Organic • Dermatologically Certified
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
