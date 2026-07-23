import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, Truck, CheckCircle2, Clock, Search, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../api/axios';

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const orderIdParam = searchParams.get('id') || '';

  const [searchId, setSearchId] = useState(orderIdParam);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statusSteps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'];

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!searchId.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/orders/${searchId.trim()}`);
      setOrder(res.data.order);
    } catch (err) {
      setError('Order not found. Please check your order ID.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderIdParam) {
      handleTrack();
    }
  }, [orderIdParam]);

  const currentStepIndex = order ? statusSteps.indexOf(order.orderStatus) : 1;

  return (
    <>
      <SEO title="Track Your Botanical Order" />

      <div className="bg-secondary py-12 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 text-center max-w-xl">
          <span className="text-xs font-semibold tracking-widest text-primary uppercase mb-2 block">
            Express Fulfillment
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-text mb-3">
            Track Order Status
          </h1>
          <p className="text-xs text-stone-500 font-light">
            Enter your order ID to trace your botanical parcel in real-time.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <form onSubmit={handleTrack} className="flex gap-3 mb-12 max-w-lg mx-auto">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Order ID (e.g. 65f12a3b4c5d...)"
            required
            className="flex-1 bg-stone-50 text-xs px-4 py-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white text-xs font-semibold px-6 py-3.5 rounded-2xl hover:bg-primary-dark transition-all flex items-center gap-1.5 shadow-md"
          >
            <Search className="w-4 h-4" /> {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="bg-rose-50 text-rose-700 text-xs p-4 rounded-2xl text-center mb-8 border border-rose-200">
            {error}
          </div>
        )}

        {/* Status Timeline Card */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-luxury space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <span className="text-xs text-stone-400 font-medium">Order ID</span>
                <h3 className="font-playfair text-xl font-bold text-text">#{order._id}</h3>
              </div>
              <div>
                <span className="text-xs text-stone-400 font-medium">Carrier</span>
                <p className="text-xs font-semibold text-primary">{order.carrier || 'BlueDart Luxury Express'}</p>
              </div>
              <div>
                <span className="text-xs text-stone-400 font-medium">Current Status</span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full block mt-0.5">
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div className="relative py-4">
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 text-center">
                {statusSteps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  return (
                    <div key={step} className="flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCompleted
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-stone-100 text-stone-400 border border-stone-200'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span className={`text-[11px] font-semibold ${isCompleted ? 'text-primary' : 'text-stone-400'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TrackOrder;
