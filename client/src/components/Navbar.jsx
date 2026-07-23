import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  LogOut,
  Package,
  ShieldAlert
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCart, setSearchOpen, toggleMobileMenu } from '../store/slices/uiSlice';
import { logout } from '../store/slices/authSlice';
import MegaMenu from './MegaMenu';
import { fetchCategoriesAPI } from '../api/queries';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { mobileMenuOpen } = useSelector((state) => state.ui);

  const [isScrolled, setIsScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategoriesAPI().then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#e8f5e9] text-[#14532D] text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 relative z-50">
        <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
        <span>COD Available | Free Shipping on orders over ₹1,499</span>
        <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
      </div>

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'glass-nav py-3 shadow-md' : 'bg-white/90 backdrop-blur-md py-4 border-b border-stone-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Icon */}
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="lg:hidden p-2 text-stone-700 hover:text-primary transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-primary text-accent flex items-center justify-center font-serif-luxury font-bold text-[15px] group-hover:scale-105 transition-transform">
              C+
            </div>
            <div className="flex flex-col">
              <span className="font-playfair text-xl font-bold tracking-tight text-primary uppercase">
                CARE+
              </span>
              <span className="text-[9px] font-semibold tracking-widest text-accent uppercase -mt-1">
                LUXURY BEAUTY
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-sm text-stone-700">
            <Link to="/" className={`hover:text-primary transition-colors ${location.pathname === '/' ? 'text-primary font-semibold' : ''}`}>
              Home
            </Link>

            <Link to="/shop" className={`hover:text-primary transition-colors ${location.pathname === '/shop' && !location.search ? 'text-primary font-semibold' : ''}`}>
              Shop All
            </Link>

            {/* Mega Menu Trigger */}
            <div
              onMouseEnter={() => setMegaMenuOpen(true)}
              className="relative cursor-pointer py-2 flex items-center gap-1 hover:text-primary transition-colors"
            >
              <span>Categories</span>
              <ChevronDown className="w-4 h-4 text-stone-400 group-hover:text-primary" />
            </div>

            <Link to="/shop?sort=bestseller" className="hover:text-primary transition-colors">
              Best Sellers
            </Link>

            <Link to="/shop?sort=newest" className="hover:text-primary transition-colors">
              New Launches
            </Link>
          </nav>

          {/* Action Controls (Search, Wishlist, Cart, Profile) */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Trigger */}
            <button
              onClick={() => dispatch(setSearchOpen(true))}
              className="p-2 text-stone-700 hover:text-primary transition-colors flex items-center gap-2 group"
              title="Search"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline-block text-xs font-medium text-stone-500">Search</span>
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 text-stone-700 hover:text-primary transition-colors group"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {wishlistItems.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 bg-accent text-stone-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
                >
                  {wishlistItems.length}
                </motion.span>
              )}
            </Link>

            {/* Cart Icon Drawer Trigger */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 text-stone-700 hover:text-primary transition-colors group flex items-center gap-1.5"
              title="Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {totalCartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md border border-white"
                  >
                    {totalCartCount}
                  </motion.span>
                )}
              </div>
              <span className="hidden md:inline-block text-xs font-semibold text-primary">Cart</span>
            </button>

            {/* User Profile / Login */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full border border-stone-200 hover:border-primary transition-all"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                    alt={user?.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="hidden sm:inline-block text-xs font-semibold text-stone-700 max-w-[80px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-stone-700 hover:text-primary transition-colors flex items-center gap-1 text-xs font-semibold"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline-block">Sign In</span>
                </Link>
              )}

              {/* Profile Dropdown */}
              <AnimatePresence>
                {userDropdownOpen && isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl shadow-xl py-2 z-50 border border-stone-200/80"
                  >
                    <div className="px-4 py-2 border-b border-stone-100 mb-1">
                      <p className="text-xs font-semibold text-text truncate">{user?.name}</p>
                      <p className="text-[11px] text-muted truncate">{user?.email}</p>
                    </div>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-accent hover:bg-amber-50/50 transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4 text-accent" /> Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/my-profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors"
                    >
                      <User className="w-4 h-4 text-primary" /> My Profile
                    </Link>

                    <Link
                      to="/my-orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors"
                    >
                      <Package className="w-4 h-4 text-primary" /> Orders & Invoices
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors border-t border-stone-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mega Menu Overlay */}
        <MegaMenu
          isOpen={megaMenuOpen}
          onClose={() => setMegaMenuOpen(false)}
          categories={categories}
        />
      </header>

      {/* Mobile Sidebar Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch(toggleMobileMenu())}
              className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10 overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-accent flex items-center justify-center font-serif-luxury font-bold text-sm">
                      C+
                    </div>
                    <span className="font-playfair text-lg font-bold text-primary">Care+</span>
                  </div>
                  <button
                    onClick={() => dispatch(toggleMobileMenu())}
                    className="p-2 text-stone-500 hover:text-stone-800"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="space-y-4 font-medium text-base text-stone-800">
                  <Link
                    to="/"
                    onClick={() => dispatch(toggleMobileMenu())}
                    className="block py-2 border-b border-stone-100 hover:text-primary"
                  >
                    Home
                  </Link>
                  <Link
                    to="/shop"
                    onClick={() => dispatch(toggleMobileMenu())}
                    className="block py-2 border-b border-stone-100 hover:text-primary"
                  >
                    Shop All
                  </Link>
                  <Link
                    to="/shop?category=botanical-skincare"
                    onClick={() => dispatch(toggleMobileMenu())}
                    className="block py-2 border-b border-stone-100 hover:text-primary"
                  >
                    Categories
                  </Link>
                  <Link
                    to="/shop?sort=bestseller"
                    onClick={() => dispatch(toggleMobileMenu())}
                    className="block py-2 border-b border-stone-100 hover:text-primary"
                  >
                    Best Sellers
                  </Link>
                  <Link
                    to="/shop?sort=newest"
                    onClick={() => dispatch(toggleMobileMenu())}
                    className="block py-2 border-b border-stone-100 hover:text-primary"
                  >
                    New Launches
                  </Link>
                </nav>
              </div>

              <div className="pt-6 border-t border-stone-100">
                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    onClick={() => dispatch(toggleMobileMenu())}
                    className="w-full bg-primary text-white text-center py-3 rounded-2xl font-semibold text-sm block"
                  >
                    Sign In / Register
                  </Link>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-rose-100 text-rose-700 text-center py-3 rounded-2xl font-semibold text-sm block"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
