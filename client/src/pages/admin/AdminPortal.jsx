import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Tag, LogOut, ShieldCheck, ArrowLeft } from 'lucide-react';
import axios from 'axios';

import Dashboard from './Dashboard';
import ProductsManager from './ProductsManager';
import OrdersManager from './OrdersManager';
import CouponsManager from './CouponsManager';
import AdminLogin from './AdminLogin';
import logo from '../../assets/logo.jpg';

function AdminPortal() {
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
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Coupons', path: '/admin/coupons', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">

      {/* Top Mobile Header */}
      <div className="md:hidden bg-stone-900 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <img src={logo} alt="EarthOra Logo" className="h-7 object-contain brightness-0 invert" />
          <span className="text-[10px] text-amber-305 font-bold uppercase tracking-wider pl-1">Admin Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={financialYear}
            onChange={handleFYChange}
            className="bg-stone-800 border border-stone-700 rounded-lg px-2 py-1 text-[10px] text-amber-302 font-bold focus:outline-none"
          >
            <option value="2025-2026">FY 25-26</option>
            <option value="2026-2027">FY 26-27</option>
            <option value="2027-2028">FY 27-28</option>
            <option value="2028-2029">FY 28-29</option>
            <option value="2029-2030">FY 29-30</option>
          </select>
          <Link to="/" className="text-[10px] text-stone-400 hover:text-white flex items-center gap-1 font-semibold">
            <ArrowLeft className="w-3 h-3" /> Store
          </Link>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-stone-900 text-white flex-col justify-between p-6 hidden md:flex shrink-0 min-h-screen sticky top-0">
        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <img src={logo} alt="EarthOra Logo" className="h-10 object-contain self-start brightness-0 invert" />
            <span className="text-[9px] text-amber-305 tracking-widest uppercase font-bold pl-1">ADMIN PORTAL</span>
            
            {/* Financial Year Selector */}
            <div className="mt-2.5 pl-1 pr-2">
              <label className="block text-[8px] text-stone-500 font-bold uppercase tracking-wider mb-1">Financial Year</label>
              <select
                value={financialYear}
                onChange={handleFYChange}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-302 font-bold focus:outline-none cursor-pointer"
              >
                <option value="2025-2026">2025-2026</option>
                <option value="2026-2027">2026-2027</option>
                <option value="2027-2028">2027-2028</option>
                <option value="2028-2029">2028-2029</option>
                <option value="2029-2030">2029-2030</option>
              </select>
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
          <Route path="*" element={<Dashboard />} />
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
