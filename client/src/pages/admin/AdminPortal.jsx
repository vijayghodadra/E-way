import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Tag, LogOut, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import Dashboard from './Dashboard';
import ProductsManager from './ProductsManager';
import OrdersManager from './OrdersManager';
import CouponsManager from './CouponsManager';
import AdminLogin from './AdminLogin';

function AdminPortal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token'));

  if (!adminToken) {
    return <AdminLogin setAdminToken={setAdminToken} />;
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdminToken(null);
    navigate('/');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Coupons', path: '/admin/coupons', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      <Toaster position="top-right" />

      {/* Top Mobile Header */}
      <div className="md:hidden bg-stone-900 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-xs">
            C+
          </div>
          <span className="font-playfair font-bold text-sm text-white">Care+ Admin</span>
        </div>
        <Link to="/" className="text-xs text-amber-300 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
        </Link>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-stone-900 text-white flex-col justify-between p-6 hidden md:flex shrink-0 min-h-screen sticky top-0">
        <div className="space-y-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-playfair font-bold text-sm">
              C+
            </div>
            <div>
              <h2 className="font-playfair text-base font-bold text-white leading-none">CARE+</h2>
              <span className="text-[9px] text-amber-300 tracking-widest uppercase font-bold">ADMIN PORTAL</span>
            </div>
          </div>

          <nav className="space-y-2 text-xs font-semibold">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-stone-800 space-y-3">
          <Link to="/" className="text-xs text-stone-400 hover:text-white flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Storefront View
          </Link>
          <button
            onClick={handleLogout}
            className="w-full bg-rose-950/40 text-rose-300 border border-rose-800/50 hover:bg-rose-900/60 font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductsManager />} />
          <Route path="/orders" element={<OrdersManager />} />
          <Route path="/coupons" element={<CouponsManager />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-stone-900 border-t border-stone-800 p-2 z-40 flex items-center justify-around">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-semibold transition-colors ${
                isActive ? 'text-amber-400 font-bold' : 'text-stone-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] text-rose-400 font-semibold"
        >
          <LogOut className="w-5 h-5" />
          <span>Exit</span>
        </button>
      </div>
    </div>
  );
}

export default AdminPortal;
