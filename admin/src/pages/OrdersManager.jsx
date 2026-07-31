import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, RefreshCw, Download, Printer, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Invoice modal editing states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editAddress, setEditAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const handleOpenInvoiceModal = (order) => {
    setSelectedOrder(order);
    setEditAddress({
      fullName: order.shippingAddress?.fullName || '',
      phone: order.shippingAddress?.phone || order.user?.phone || '',
      street: order.shippingAddress?.street || '',
      city: order.shippingAddress?.city || '',
      state: order.shippingAddress?.state || '',
      zipCode: order.shippingAddress?.zipCode || '',
      country: order.shippingAddress?.country || 'India'
    });
    setIsEditMode(false);
    setIsInvoiceOpen(true);
  };

  const handleSaveInvoiceAddress = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.put(
        `/api/v1/admin/orders/${selectedOrder._id}`,
        { shippingAddress: editAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success('Customer details updated successfully!');
        setSelectedOrder(res.data.order);
        setIsEditMode(false);
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update details on this invoice');
    }
  };

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

  const getSubtotal = (order) => {
    return order.orderItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
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
            className="bg-stone-880 hover:bg-stone-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
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
                <th className="py-3 px-4 text-center">Invoice</th>
                <th className="py-3 px-4 text-right">Update Status</th>
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
                    <p className="font-semibold text-stone-800">{ord.shippingAddress?.phone || ord.user?.phone || 'N/A'}</p>
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
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleOpenInvoiceModal(ord)}
                      className="bg-stone-50 border border-stone-200 text-stone-650 hover:bg-stone-100 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all mx-auto"
                    >
                      <FileText className="w-3.5 h-3.5" /> View/Edit
                    </button>
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

      {/* Admin Invoice View, Print & Edit Modal */}
      {isInvoiceOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <style>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #admin-print-invoice, #admin-print-invoice * {
                visibility: visible !important;
              }
              #admin-print-invoice {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                background: white !important;
                color: black !important;
                box-shadow: none !important;
                border: none !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>
          
          <div 
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity no-print" 
            onClick={() => setIsInvoiceOpen(false)}
          />

          <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
            {/* Modal Controls Banner */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50 no-print flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <h4 className="font-semibold text-stone-800 text-sm">Invoice Panel</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                    isEditMode ? 'bg-amber-100 text-stone-900 hover:bg-amber-200' : 'bg-indigo-50 text-indigo-750 hover:bg-indigo-100'
                  }`}
                >
                  {isEditMode ? 'Close Edit Form' : 'Edit Invoice Data'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-stone-900 transition-all shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Invoice
                </button>
                <button
                  onClick={() => setIsInvoiceOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-700 transition-colors rounded-full hover:bg-stone-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col lg:flex-row gap-8">
              {/* Left Side: Invoice display Area (Targeted by printing) */}
              <div id="admin-print-invoice" className="flex-1 bg-white border border-stone-200 p-6 rounded-2xl shadow-sm text-stone-800">
                {/* Header */}
                <div className="flex justify-between items-start gap-4 pb-6 border-b border-stone-100">
                  <div>
                    <h2 className="text-2xl font-bold text-primary tracking-wide">Earthora</h2>
                    <p className="text-[9px] text-stone-400 font-medium tracking-wide uppercase mt-0.5">
                      100% Certified Clean Remedies
                    </p>
                    <div className="mt-3 text-[11px] text-stone-500 space-y-0.5 leading-normal font-light">
                      <p>45 Lotus Botanical Boulevard, BKC</p>
                      <p>Mumbai, Maharashtra, 400051</p>
                      <p>support@earthora.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-wider mb-2 font-sans">
                      TAX INVOICE
                    </span>
                    <h3 className="text-base font-bold font-mono text-stone-900">
                      {selectedOrder.orderNumber || `#${selectedOrder._id.slice(-8).toUpperCase()}`}
                    </h3>
                    <div className="mt-3 text-[11px] text-stone-500 space-y-0.5 leading-normal font-light">
                      <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> <span className="font-semibold text-emerald-700">{selectedOrder.orderStatus}</span></p>
                      <p><strong>Payment Status:</strong> {selectedOrder.isPaid ? 'Paid' : 'Pending Verification (COD)'}</p>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 bg-stone-50 p-4 rounded-xl border border-stone-150 my-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                      Customer Profile
                    </h4>
                    <div className="text-[11px] font-semibold space-y-0.5 text-stone-800">
                      <p className="text-stone-900">{selectedOrder.user?.name || selectedOrder.shippingAddress?.fullName}</p>
                      <p className="font-light text-stone-500">{selectedOrder.user?.email || 'N/A'}</p>
                      <p className="font-light text-stone-500">{selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                      Shipping Details
                    </h4>
                    <div className="text-[11px] font-semibold space-y-0.5 text-stone-800">
                      <p className="text-stone-900">{selectedOrder.shippingAddress?.fullName}</p>
                      <p className="font-light leading-normal text-stone-600">
                        {selectedOrder.shippingAddress?.street},<br />
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - <strong>{selectedOrder.shippingAddress?.zipCode}</strong>
                      </p>
                      <p className="font-light text-stone-500">{selectedOrder.shippingAddress?.country || 'India'}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[9px]">
                      <th className="py-2">Item</th>
                      <th className="py-2 text-center">Price</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800 font-medium">
                    {selectedOrder.orderItems?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 font-semibold text-stone-900">{item.title}</td>
                        <td className="py-2.5 text-center font-sans">₹{item.price.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 text-center">{item.quantity}</td>
                        <td className="py-2.5 text-right font-bold text-stone-900 font-sans">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary */}
                <div className="flex justify-end pt-4 border-t border-stone-250 mt-4 font-semibold">
                  <div className="w-full sm:w-64 space-y-1.5 text-xs text-stone-650 font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-sans">₹{getSubtotal(selectedOrder).toLocaleString('en-IN')}</span>
                    </div>
                    {selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-800">
                        <span>Coupon Discount</span>
                        <span className="font-sans">-₹{selectedOrder.discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Express Delivery Fee</span>
                      <span className="font-sans">
                        {selectedOrder.shippingPrice === 0 ? <strong className="text-emerald-700 font-bold font-sans">FREE</strong> : `₹${selectedOrder.shippingPrice}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t border-stone-150">
                      <span>Grand Total</span>
                      <span className="text-base text-primary font-sans font-extrabold text-[14px]">
                        ₹{selectedOrder.totalPrice?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Edit Form Fields (Only Visible when editing, hidden in print anyway) */}
              {isEditMode && (
                <div className="w-full lg:w-80 bg-stone-50 border border-stone-200 p-6 rounded-2xl space-y-4 no-print shrink-0">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 pb-2 border-b border-stone-200">
                    Edit Shipping Data
                  </h4>

                  <div className="space-y-3 text-xs font-semibold">
                    <div>
                      <label className="block text-stone-600 mb-1">Customer Full Name</label>
                      <input
                        type="text"
                        value={editAddress.fullName}
                        onChange={(e) => setEditAddress({ ...editAddress, fullName: e.target.value })}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={editAddress.phone}
                        onChange={(e) => setEditAddress({ ...editAddress, phone: e.target.value })}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1">Street Address</label>
                      <input
                        type="text"
                        value={editAddress.street}
                        onChange={(e) => setEditAddress({ ...editAddress, street: e.target.value })}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-stone-600 mb-1">City</label>
                        <input
                          type="text"
                          value={editAddress.city}
                          onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })}
                          className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1">State</label>
                        <input
                          type="text"
                          value={editAddress.state}
                          onChange={(e) => setEditAddress({ ...editAddress, state: e.target.value })}
                          className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1">Zip Code / Pincode</label>
                      <input
                        type="text"
                        value={editAddress.zipCode}
                        onChange={(e) => setEditAddress({ ...editAddress, zipCode: e.target.value })}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                      />
                    </div>

                    <button
                      onClick={handleSaveInvoiceAddress}
                      className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center font-sans tracking-wide"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
