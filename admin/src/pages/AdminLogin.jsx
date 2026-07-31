import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

import logo from '../assets/logo.png';

const AdminLogin = ({ setAdminToken }) => {
  const navigate = useNavigate();
  const getCurrentFinancialYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed: 3 = April
    const startYear = month >= 3 ? year : year - 1;
    return `${startYear}-${startYear + 1}`;
  };

  const [email, setEmail] = useState('admin@earthora.com');
  const [password, setPassword] = useState('admin@earthora123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [financialYear, setFinancialYear] = useState(
    localStorage.getItem('financial_year') || getCurrentFinancialYear()
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/v1/auth/login', { email, password });
      if (res.data.user?.role === 'admin') {
        localStorage.setItem('admin_token', res.data.token);
        localStorage.setItem('admin_user', JSON.stringify(res.data.user));
        localStorage.setItem('financial_year', financialYear);
        axios.defaults.headers.common['X-Financial-Year'] = financialYear;
        setAdminToken(res.data.token);
        toast.success('Welcome to Admin Portal!');
        navigate('/');
      } else {
        toast.error('Access Denied: Admin role required');
      }
    } catch (err) {
      toast.error('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-800 rounded-3xl p-8 border border-stone-700 shadow-2xl space-y-6">
        <div className="text-center">
          <img src={logo} alt="Earth Ora Logo" className="h-10 object-contain mx-auto mb-3 brightness-0 invert" />
          <p className="text-xs text-stone-400 font-light mt-1">Management Portal & Inventory Control</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs font-medium">
          <div>
            <label className="block text-stone-300 mb-1">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            </div>
            <div className="flex items-center mt-2.5 pl-1">
              <input 
                type="checkbox" 
                id="showPassword" 
                checked={showPassword} 
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-stone-700 bg-stone-900 text-accent focus:ring-accent focus:ring-offset-stone-850"
              />
              <label htmlFor="showPassword" className="text-[11px] text-stone-400 ml-2 select-none cursor-pointer">
                Show Password
              </label>
            </div>
          </div>

          <div>
            <label className="block text-stone-300 mb-1 font-semibold">Active Financial Year</label>
            <select
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-accent text-xs font-semibold cursor-pointer"
            >
              <option value="2025-2026">2025-2026 (1 Apr 2025 - 31 Mar 2026)</option>
              <option value="2026-2027">2026-2027 (1 Apr 2026 - 31 Mar 2027)</option>
              <option value="2027-2028">2027-2028 (1 Apr 2027 - 31 Mar 2028)</option>
              <option value="2028-2029">2028-2029 (1 Apr 2028 - 31 Mar 2029)</option>
              <option value="2029-2030">2029-2030 (1 Apr 2029 - 31 Mar 2030)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-stone-950 font-bold py-3.5 rounded-xl hover:bg-amber-400 transition-colors shadow-md"
          >
            {loading ? 'Authenticating...' : 'Sign In To Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
