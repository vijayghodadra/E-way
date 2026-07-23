import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../api/axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <SEO title="My Order History & Invoices" />

      <div className="bg-secondary py-12 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-text">My Order History</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-stone-100 rounded-3xl" />
            <div className="h-32 bg-stone-100 rounded-3xl" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-200">
            <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="font-playfair text-xl font-semibold text-text mb-2">
              No previous orders found
            </h3>
            <p className="text-xs text-muted max-w-xs mx-auto mb-6">
              When you purchase our luxury formulations, your invoices and tracking history will appear here.
            </p>
            <Link to="/shop" className="bg-primary text-white text-xs font-semibold px-6 py-3 rounded-2xl">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-luxury transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
                  <div>
                    <span className="text-[11px] text-stone-400 font-medium">Order Reference</span>
                    <h4 className="font-playfair text-base font-bold text-text">#{order._id}</h4>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-400 font-medium">Date</span>
                    <p className="text-xs font-semibold text-stone-700">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-400 font-medium">Total</span>
                    <p className="text-xs font-bold text-primary">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-4">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-stone-50 p-2.5 rounded-2xl border border-stone-100">
                      <img src={item.image} alt={item.title} className="w-10 h-10 rounded-xl object-cover" />
                      <div className="text-xs">
                        <p className="font-semibold text-text max-w-[150px] truncate">{item.title}</p>
                        <span className="text-stone-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Link
                    to={`/track-order?id=${order._id}`}
                    className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-primary-dark"
                  >
                    <Package className="w-3.5 h-3.5" /> Track Package
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrders;
