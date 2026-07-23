import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Phone, MapPin, Package, ShieldCheck, Save } from 'lucide-react';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { updateUser } from '../store/slices/authSlice';

const MyProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', { name, phone });
      if (res.data.success) {
        dispatch(updateUser(res.data.user));
        toast.success('Profile updated successfully!', { icon: '✨' });
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="My Account Profile" />

      <div className="bg-secondary py-12 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-text">Customer Profile</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-luxury space-y-8">
          <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary"
            />
            <div>
              <h3 className="font-playfair text-xl font-bold text-text">{user?.name}</h3>
              <p className="text-xs text-muted font-medium">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 text-xs font-medium max-w-lg">
            <div>
              <label className="block text-stone-600 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-text focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-stone-600 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-text focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white font-semibold py-3.5 px-8 rounded-2xl hover:bg-primary-dark transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
