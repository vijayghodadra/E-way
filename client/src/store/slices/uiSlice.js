import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCartOpen: false,
  isSearchOpen: false,
  quickViewProduct: null,
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    },
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    setSearchOpen: (state, action) => {
      state.isSearchOpen = action.payload;
    },
    setQuickViewProduct: (state, action) => {
      state.quickViewProduct = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
  },
});

export const {
  toggleCart,
  setCartOpen,
  toggleSearch,
  setSearchOpen,
  setQuickViewProduct,
  toggleMobileMenu,
} = uiSlice.actions;

export default uiSlice.reducer;
