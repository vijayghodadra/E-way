import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { User, Mail, Lock, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { setCredentials } from '../store/slices/authSlice';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
        toast.success('Account created successfully!', { icon: '🌿' });
        navigate('/');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Create Account | Élixir Botanicals" />

      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-secondary/40">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-stone-200/80 shadow-luxury space-y-6">
          <div className="text-center">
            <span className="champagne-badge text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 mb-2">
              <Sparkles className="w-3 h-3" /> Exclusive Membership
            </span>
            <h1 className="font-playfair text-2xl font-bold text-text">Join The Élixir Family</h1>
            <p className="text-xs text-stone-500 font-light mt-1">Unlock 15% off your first luxury order</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-stone-600 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ananya Sharma"
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3.5 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ananya@example.com"
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3.5 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98123 45678"
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3.5 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
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
              {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-stone-500 font-medium">
            Already registered?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
