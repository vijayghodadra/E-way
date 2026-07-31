import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  coupon: null, // { code, discountAmount, discountType, discountValue }
  freeShippingThreshold: 1499,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.product._id === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
          price: product.discountPrice > 0 ? product.discountPrice : product.price,
        });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.product._id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.product._id === productId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.product._id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload;
    },
    removeCoupon: (state) => {
      state.coupon = null;
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
