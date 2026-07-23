import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminLogin = ({ setAdminToken }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@elixirbotanicals.com');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/v1/auth/login', { email, password });
      if (res.data.user?.role === 'admin') {
        localStorage.setItem('admin_token', res.data.token);
        localStorage.setItem('admin_user', JSON.stringify(res.data.user));
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
          <div className="w-12 h-12 rounded-full bg-accent text-stone-950 flex items-center justify-center mx-auto mb-3 font-bold text-base">
            C+
          </div>
          <h1 className="font-playfair text-2xl font-bold">Care+ Executive Admin</h1>
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            </div>
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
