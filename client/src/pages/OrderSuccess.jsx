import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Printer, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../api/axios';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <>
      <SEO title="Order Confirmed!" />

      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-primary flex items-center justify-center mx-auto mb-6 shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="champagne-badge text-xs px-3.5 py-1 rounded-full font-semibold uppercase tracking-wider inline-flex items-center gap-1 mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Order Successfully Placed
        </span>

        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-text mb-3">
          Thank You For Choosing Élixir Botanicals
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-8 font-light">
          Your order <strong>#{id ? id.slice(-8).toUpperCase() : 'EB-9482'}</strong> has been received and is currently being hand-prepared by our master alchemists.
        </p>

        {/* Action Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            to={`/track-order?id=${id}`}
            className="bg-primary text-white text-xs font-semibold px-6 py-3.5 rounded-2xl hover:bg-primary-dark transition-all flex items-center gap-2 shadow-luxury"
          >
            <Package className="w-4 h-4" /> Track Order Status
          </Link>
          <Link
            to="/shop"
            className="bg-stone-100 text-stone-700 text-xs font-semibold px-6 py-3.5 rounded-2xl hover:bg-stone-200 transition-all flex items-center gap-2"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
