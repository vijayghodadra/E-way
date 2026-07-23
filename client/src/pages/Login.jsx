import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { setCredentials } from '../store/slices/authSlice';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
        toast.success(`Welcome back, ${res.data.user.name}!`, { icon: '🌿' });
        navigate('/');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Sign In | Élixir Botanicals" />

      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-secondary/40">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-stone-200/80 shadow-luxury space-y-6">
          <div className="text-center">
            <span className="champagne-badge text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 mb-2">
              <Sparkles className="w-3 h-3" /> Member Portal
            </span>
            <h1 className="font-playfair text-2xl font-bold text-text">Sign In To Élixir</h1>
            <p className="text-xs text-stone-500 font-light mt-1">Access your saved rituals & order history</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-stone-600 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@elixirbotanicals.com"
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3.5 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3.5 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-4 rounded-2xl hover:bg-primary-dark transition-all shadow-luxury flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Preset Buttons */}
          <div className="pt-4 border-t border-stone-100 space-y-2 text-center">
            <span className="text-[11px] text-stone-400 font-medium block">Or Try Demo Credentials:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setEmail('user@elixirbotanicals.com'); setPassword('User@123456'); }}
                className="flex-1 bg-stone-100 text-stone-700 text-[11px] font-semibold py-2 rounded-xl hover:bg-stone-200"
              >
                Fill Customer Demo
              </button>
              <button
                type="button"
                onClick={() => { setEmail('admin@elixirbotanicals.com'); setPassword('Admin@123456'); }}
                className="flex-1 bg-amber-100 text-amber-900 text-[11px] font-semibold py-2 rounded-xl hover:bg-amber-200"
              >
                Fill Admin Demo
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-stone-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
