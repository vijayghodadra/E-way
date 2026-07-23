import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, ArrowRight, Truck, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setCartOpen } from '../store/slices/uiSlice';
import { updateQuantity, removeFromCart, applyCoupon, removeCoupon } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import api from '../api/axios';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isCartOpen } = useSelector((state) => state.ui);
  const { items, coupon, freeShippingThreshold } = useSelector((state) => state.cart);

  const [couponInput, setCouponInput] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = coupon ? coupon.discountAmount : 0;
  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 99;
  const estimatedTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidatingCoupon(true);
    try {
      const res = await api.post('/coupons/validate', {
        code: couponInput.trim(),
        cartTotal: subtotal
      });

      if (res.data.success) {
        dispatch(
          applyCoupon({
            code: res.data.code,
            discountAmount: res.data.discountAmount,
            discountType: res.data.discountType,
            discountValue: res.data.discountValue
          })
        );
        toast.success(res.data.message);
        setCouponInput('');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid coupon code';
      toast.error(msg);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleCheckoutClick = () => {
    dispatch(setCartOpen(false));
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(setCartOpen(false))}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <ShoppingBag className="w-5 h-5" />
              <span className="font-playfair text-lg">Your Botanical Bag</span>
              <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                {items.length} items
              </span>
            </div>
            <button
              onClick={() => dispatch(setCartOpen(false))}
              className="p-2 text-stone-400 hover:text-stone-700 transition-colors rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-primary/5 p-4 border-b border-primary/10">
            <div className="flex items-center justify-between text-xs font-semibold text-primary mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-accent" />
                {remainingForFreeShipping > 0
                  ? `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} more for Free Express Delivery`
                  : 'Congratulations! You unlocked Free Express Delivery!'}
              </span>
              <span>{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${freeShippingProgress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-playfair text-lg font-semibold text-text mb-1">
                  Your bag is currently empty
                </h4>
                <p className="text-xs text-muted max-w-xs mb-6">
                  Explore our luxury botanical serums, cold-pressed oils, and herbal hair elixirs.
                </p>
                <button
                  onClick={() => {
                    dispatch(setCartOpen(false));
                    navigate('/shop');
                  }}
                  className="bg-primary text-white text-xs font-semibold px-6 py-3 rounded-2xl hover:bg-primary-dark transition-all"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex gap-4 p-3 rounded-2xl border border-stone-100 bg-stone-50/50 hover:bg-white transition-all shadow-sm"
                >
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.title}
                    className="w-20 h-20 rounded-xl object-cover bg-stone-100 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-playfair text-sm font-semibold text-text line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => dispatch(removeFromCart(item.product._id))}
                          className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-stone-400">{item.product.volume}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-sm text-primary">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-2 py-1">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.product._id,
                                quantity: item.quantity - 1
                              })
                            )
                          }
                          className="text-stone-500 hover:text-primary p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.product._id,
                                quantity: item.quantity + 1
                              })
                            )
                          }
                          className="text-stone-500 hover:text-primary p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout section */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-100 bg-white shadow-2xl space-y-4">
              {/* Coupon Code Section */}
              {coupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Coupon <strong>{coupon.code}</strong> applied (-₹{coupon.discountAmount})</span>
                  </div>
                  <button
                    onClick={() => dispatch(removeCoupon())}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon Code (e.g. LUXURY15)"
                    className="flex-1 bg-stone-100 text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={isValidatingCoupon}
                    className="bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-primary transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Order Summary Pricing Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Delivery</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-600 uppercase text-[10px]">Free</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t border-stone-100">
                  <span>Estimated Total</span>
                  <span>₹{estimatedTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-primary text-white text-sm font-semibold py-4 rounded-2xl hover:bg-primary-dark transition-all shadow-luxury flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CartDrawer;
