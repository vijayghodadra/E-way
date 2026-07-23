import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get('/api/v1/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(
        `/api/v1/admin/orders/${orderId}/status`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="font-playfair text-2xl font-bold text-stone-900">Fulfillment & Orders</h1>
        <p className="text-xs text-stone-500 font-medium">Manage order status pipeline from Packing to Delivery.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Update Workflow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-stone-50">
                  <td className="py-3 px-4 font-bold text-emerald-900">#{ord._id}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold">{ord.user?.name || 'Customer'}</p>
                    <span className="text-[10px] text-stone-400">{ord.shippingAddress?.city}</span>
                  </td>
                  <td className="py-3 px-4 font-bold">₹{ord.totalPrice?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      className="bg-stone-50 border border-stone-200 rounded-lg text-xs px-2.5 py-1 font-semibold focus:outline-none"
                    >
                      {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'].map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersManager;
