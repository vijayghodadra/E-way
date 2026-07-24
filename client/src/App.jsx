import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import SearchModal from './components/SearchModal';

// Route Code Splitting
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminPortal = lazy(() => import('./pages/admin/AdminPortal'));

// Minimalist Page Loading Fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
    <div className="w-10 h-10 border-3 border-stone-200 border-t-primary rounded-full animate-spin" />
    <span className="text-xs font-serif-luxury font-semibold text-primary tracking-widest uppercase animate-pulse">
      Élixir Botanicals
    </span>
  </div>
);

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-primary selection:text-white">
      {/* Toast Notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Global Storefront Overlays */}
      {!isAdminRoute && (
        <>
          <Navbar />
          <CartDrawer />
          <QuickViewModal />
          <SearchModal />
        </>
      )}

      {/* Route Views */}
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/admin/*" element={<AdminPortal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
