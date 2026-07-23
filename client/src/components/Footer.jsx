import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowRight, ShieldCheck, Truck, RefreshCw, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('Welcome to Élixir Society! Check your inbox for your 15% luxury voucher.', {
        style: {
          background: '#14532D',
          color: '#FFFFFF',
          borderRadius: '16px'
        },
        icon: '✨'
      });
      setEmail('');
    }
  };

  return (
    <footer className="bg-primary-dark text-stone-300 font-poppins pt-16 pb-8 border-t border-stone-800 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Value Proposition Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 pb-12 border-b border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-playfair text-sm font-semibold text-white">Express Delivery</h4>
            <p className="text-xs text-stone-400 mt-0.5">Complimentary on orders above ₹1,499</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-playfair text-sm font-semibold text-white">100% Organically Certified</h4>
            <p className="text-xs text-stone-400 mt-0.5">Wild-harvested cold-pressed actives</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-playfair text-sm font-semibold text-white">Encrypted Checkout</h4>
            <p className="text-xs text-stone-400 mt-0.5">Razorpay, UPI, NetBanking & COD</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-playfair text-sm font-semibold text-white">Hassle-Free Returns</h4>
            <p className="text-xs text-stone-400 mt-0.5">14-Day botanical satisfaction guarantee</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-accent text-stone-950 flex items-center justify-center font-serif-luxury font-bold text-lg">
              C+
            </div>
            <span className="font-playfair text-2xl font-bold tracking-tight text-white uppercase">
              CARE+
            </span>
          </Link>
          <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
            Harnessing age-old Ayurvedic wisdom and bio-active botanical extractions to create transformative, non-toxic luxury skincare remedies.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-accent">
            <Sparkles className="w-4 h-4" /> Cruelty-Free • Paraben-Free • Vegan Formulations
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="md:col-span-2">
          <h4 className="font-playfair text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Collections
          </h4>
          <ul className="space-y-2.5 text-xs text-stone-400 font-medium">
            <li><Link to="/shop?category=botanical-skincare" className="hover:text-accent transition-colors">Botanical Skincare</Link></li>
            <li><Link to="/shop?category=herbal-hair-care" className="hover:text-accent transition-colors">Herbal Hair Remedies</Link></li>
            <li><Link to="/shop?category=artisanal-body-care" className="hover:text-accent transition-colors">Artisanal Body Care</Link></li>
            <li><Link to="/shop?category=aromatherapy-wellness" className="hover:text-accent transition-colors">Aromatherapy Rituals</Link></li>
            <li><Link to="/shop?sort=bestseller" className="hover:text-accent transition-colors">Best Sellers</Link></li>
          </ul>
        </div>

        {/* Column 3: Customer Care & Policies */}
        <div className="md:col-span-2">
          <h4 className="font-playfair text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-xs text-stone-400 font-medium">
            <li><Link to="/track-order" className="hover:text-accent transition-colors">Track Your Order</Link></li>
            <li><Link to="/faq" className="hover:text-accent transition-colors">FAQs & Support</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-accent transition-colors">Shipping Policy</Link></li>
            <li><Link to="/refund-policy" className="hover:text-accent transition-colors">Refund & Returns</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-conditions" className="hover:text-accent transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="md:col-span-4">
          <h4 className="font-playfair text-sm font-semibold text-white uppercase tracking-wider mb-2">
            Join The Care+ Club
          </h4>
          <p className="text-xs text-stone-400 leading-relaxed mb-4">
            Receive exclusive access to private botanical drops, seasonal rituals, and 15% off your first order.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-3">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-accent transition-colors"
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-stone-950 font-semibold text-xs py-3 rounded-xl hover:bg-accent-light transition-all flex items-center justify-center gap-1.5 shadow-gold"
            >
              Subscribe To Rituals <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
        <p>© {new Date().getFullYear()} Care+. All rights reserved.</p>
        <div className="flex items-center gap-4 text-stone-300 font-semibold text-[11px]">
          <span className="bg-white/10 px-2.5 py-1 rounded">Razorpay Verified</span>
          <span className="bg-white/10 px-2.5 py-1 rounded">UPI</span>
          <span className="bg-white/10 px-2.5 py-1 rounded">Visa / Mastercard</span>
          <span className="bg-white/10 px-2.5 py-1 rounded">COD</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
