import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, RefreshCw, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const exportToCSV = () => {
    if (!orders || orders.length === 0) {
      toast.error('No orders to export');
      return;
    }
    
    const headers = [
      'Order Ref',
      'Customer Name',
      'Email',
      'Mobile Number',
      'Street',
      'City',
      'State',
      'Zip Code',
      'Payment Method',
      'Total Price',
      'Status',
      'Date'
    ];
    
    const rows = orders.map(ord => [
      `"${ord.orderNumber || ord._id}"`,
      `"${ord.user?.name || ''}"`,
      `"${ord.user?.email || ''}"`,
      `"${ord.shippingAddress?.phone || ord.user?.phone || ''}"`,
      `"${(ord.shippingAddress?.street || '').replace(/"/g, '""')}"`,
      `"${ord.shippingAddress?.city || ''}"`,
      `"${ord.shippingAddress?.state || ''}"`,
      `"${ord.shippingAddress?.zipCode || ''}"`,
      `"${ord.paymentMethod === 'Razorpay' ? 'Razorpay Payment' : 'Cash on Delivery'}"`,
      ord.totalPrice || 0,
      `"${ord.orderStatus}"`,
      `"${new Date(ord.createdAt).toLocaleDateString()}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders exported successfully!');
  };

  const exportToPDF = () => {
    if (!orders || orders.length === 0) {
      toast.error('No orders to print');
      return;
    }
    const printWindow = window.open('', '_blank');
    const tableHtml = `
      <html>
        <head>
          <title>Orders Fulfillment Report</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; color: #1c1917; }
            h1 { font-size: 20px; font-weight: bold; margin-bottom: 4px; }
            p { font-size: 11px; color: #78716c; margin-top: 0; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; text-align: left; }
            th { background-color: #f5f5f4; border-bottom: 2px solid #e7e5e4; padding: 8px; font-weight: bold; color: #44403c; text-transform: uppercase; }
            td { border-bottom: 1px solid #f5f5f4; padding: 8px; vertical-align: top; }
            .font-bold { font-weight: bold; }
            .text-emerald { color: #064e3b; }
            .status-badge { display: inline-block; padding: 2px 6px; border-radius: 9999px; font-size: 9px; font-weight: bold; background-color: #fef3c7; color: #78350f; }
          </style>
        </head>
        <body>
          <h1>Orders Fulfillment Report</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Shipping Address</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(ord => `
                <tr>
                  <td class="font-bold text-emerald">${ord.orderNumber || `#${ord._id.slice(-6)}`}</td>
                  <td>${ord.user?.name || 'Customer'}</td>
                  <td>${ord.user?.email || 'N/A'}</td>
                  <td>${ord.shippingAddress?.phone || ord.user?.phone || 'N/A'}</td>
                  <td>${ord.shippingAddress ? `${ord.shippingAddress.street}, ${ord.shippingAddress.city}, ${ord.shippingAddress.state} - ${ord.shippingAddress.zipCode}` : 'N/A'}</td>
                  <td>${ord.paymentMethod === 'Razorpay' ? 'Razorpay Payment' : 'Cash on Delivery'}</td>
                  <td class="font-bold">₹${ord.totalPrice?.toLocaleString('en-IN')}</td>
                  <td><span class="status-badge">${ord.orderStatus}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(tableHtml);
    printWindow.document.close();
  };

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Fulfillment & Orders</h1>
          <p className="text-xs text-stone-500 font-medium">Manage order status pipeline from Packing to Delivery.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Excel/CSV
          </button>
          <button
            onClick={exportToPDF}
            className="bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" /> Export PDF/Print
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Shipping Contact & Address</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Update Workflow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-stone-50">
                  <td className="py-3 px-4 font-bold text-primary font-mono text-[11px]">
                    {ord.orderNumber || `#${ord._id.slice(-6)}`}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-stone-900">{ord.user?.name || 'Customer'}</p>
                    <p className="text-[10px] text-stone-400 font-normal">{ord.user?.email || 'N/A'}</p>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="font-semibold text-stone-850">{ord.shippingAddress?.phone || ord.user?.phone || 'N/A'}</p>
                    <p className="text-[10px] text-stone-400 font-normal leading-normal whitespace-pre-line" title={ord.shippingAddress ? `${ord.shippingAddress.street}, ${ord.shippingAddress.city}, ${ord.shippingAddress.state} - ${ord.shippingAddress.zipCode}` : 'N/A'}>
                      {ord.shippingAddress ? `${ord.shippingAddress.street}, ${ord.shippingAddress.city}, ${ord.shippingAddress.state} - ${ord.shippingAddress.zipCode}` : 'N/A'}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${ord.paymentMethod === 'Razorpay' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/50' : 'bg-amber-50 text-amber-700 border border-amber-200/50'}`}>
                      {ord.paymentMethod === 'Razorpay' ? 'Razorpay' : 'Cash on Delivery'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold">₹{ord.totalPrice?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      ord.orderStatus === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-900'
                    }`}>
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
