import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you! Our Botanical Concierge will reach out within 24 hours.', { icon: '✨' });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <SEO title="Concierge & Contact Us" />

      <div className="bg-secondary py-12 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-text">Botanical Concierge</h1>
          <p className="text-xs text-stone-500 font-light mt-1">We are here to assist with product consultation & orders</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-luxury space-y-4 text-xs font-medium">
          <div>
            <label className="block text-stone-600 mb-1">Your Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-text"
            />
          </div>
          <div>
            <label className="block text-stone-600 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-text"
            />
          </div>
          <div>
            <label className="block text-stone-600 mb-1">Message / Consultation Request</label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-text"
            />
          </div>
          <button type="submit" className="bg-primary text-white font-semibold py-3.5 px-8 rounded-2xl flex items-center gap-2">
            <Send className="w-4 h-4" /> Send Message
          </button>
        </form>
      </div>
    </>
  );
};

export default Contact;
