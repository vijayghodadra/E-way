import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Tag, LogOut, ShieldCheck } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import logo from './assets/logo.jpg';

import Dashboard from './pages/Dashboard';
import ProductsManager from './pages/ProductsManager';
import OrdersManager from './pages/OrdersManager';
import CouponsManager from './pages/CouponsManager';
import AdminLogin from './pages/AdminLogin';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token'));
  const [financialYear, setFinancialYear] = useState(
    localStorage.getItem('financial_year') || '2026-2027'
  );

  useEffect(() => {
    if (adminToken) {
      axios.defaults.headers.common['X-Financial-Year'] = financialYear;
    }
  }, [financialYear, adminToken]);

  const handleFYChange = (e) => {
    const nextFY = e.target.value;
    localStorage.setItem('financial_year', nextFY);
    setFinancialYear(nextFY);
    window.location.reload();
  };

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
    { label: 'Executive Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Products & Inventory', path: '/products', icon: Package },
    { label: 'Fulfillment & Orders', path: '/orders', icon: ShoppingBag },
    { label: 'Promotions & Coupons', path: '/coupons', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex">
      <Toaster position="top-right" />

      {/* Admin Sidebar */}
      <aside className="w-64 bg-stone-900 text-white flex flex-col justify-between p-6 hidden md:flex">
        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <img src={logo} alt="EarthOra Logo" className="h-10 object-contain self-start brightness-0 invert" />
            <span className="text-[9px] text-accent tracking-widest uppercase font-bold pl-1 font-bold">ADMIN PORTAL</span>

            {/* Financial Year Selector */}
            <div className="mt-2.5 pl-1 pr-2">
              <label className="block text-[8px] text-stone-500 font-bold uppercase tracking-wider mb-1">Financial Year</label>
              <select
                value={financialYear}
                onChange={handleFYChange}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-accent font-bold focus:outline-none cursor-pointer"
              >
                <option value="2025-2026">2025-2026</option>
                <option value="2026-2027">2026-2027</option>
                <option value="2027-2028">2027-2028</option>
                <option value="2028-2029">2028-2029</option>
                <option value="2029-2030">2029-2030</option>
              </select>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-accent text-stone-950 font-bold shadow-md'
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
          <div className="flex items-center gap-2 text-stone-400 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-accent" /> Protected Admin Session
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-rose-950/40 text-rose-300 border border-rose-800/50 hover:bg-rose-900/60 font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductsManager />} />
          <Route path="/orders" element={<OrdersManager />} />
          <Route path="/coupons" element={<CouponsManager />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
