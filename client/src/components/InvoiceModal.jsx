import React from 'react';
import { X, Printer, ShieldCheck } from 'lucide-react';

const InvoiceModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const getSubtotal = () => {
    return order.orderItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Print-specific style tag injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-area, #print-area * {
            visibility: visible !important;
          }
          /* Reset parent modal wrapper height caps to avoid scroll viewport print clipping */
          html, body, #root, .fixed.inset-0, .relative.bg-white {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            position: static !important;
            visibility: visible !important;
          }
          #print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            visibility: visible !important;
          }
          .no-print {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>

      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity no-print" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Modal Controls (No Print) */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-stone-100 bg-stone-50 no-print flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <h4 className="font-playfair text-sm font-semibold text-text">Customer Invoice Viewer</h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-primary-dark transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Print Invoice
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 transition-colors rounded-full hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Page Body (Targeted by print instructions) */}
        <div id="print-area" className="flex-1 overflow-y-auto p-6 sm:p-10 font-sans text-stone-850">
          <div className="space-y-8">
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-stone-100">
              <div>
                <h2 className="font-playfair text-3xl font-extrabold text-primary tracking-wide">
                  Earthora
                </h2>
                <p className="text-[10px] text-stone-400 font-medium tracking-wide uppercase mt-1">
                  100% Certified Clean Remedies
                </p>
                <div className="mt-4 text-xs text-stone-500 space-y-0.5 leading-relaxed font-light">
                  <p>45 Lotus Botanical Boulevard, BKC</p>
                  <p>Mumbai, Maharashtra, 400051</p>
                  <p>Support: support@earthora.com</p>
                </div>
              </div>
              <div className="sm:text-right">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-2">
                  TAX INVOICE
                </span>
                <h3 className="text-xl font-bold font-mono text-stone-900 mt-1">
                  {order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`}
                </h3>
                <div className="mt-3 text-xs text-stone-500 space-y-0.5 leading-relaxed font-light">
                  <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</p>
                  <p><strong>Status:</strong> <span className="font-semibold text-emerald-700">{order.orderStatus}</span></p>
                  <p><strong>Payment Status:</strong> {order.isPaid ? 'Paid' : 'Pending Verification (COD)'}</p>
                </div>
              </div>
            </div>

            {/* Billing & Shipping Details Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-stone-50 p-5 rounded-2xl border border-stone-150">
              <div>
                <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Customer Profile
                </h4>
                <div className="text-xs font-medium space-y-1 text-stone-850">
                  <p className="font-bold text-stone-900">{order.user?.name || order.shippingAddress?.fullName}</p>
                  <p className="font-light text-stone-500">{order.user?.email || 'Customer Email: N/A'}</p>
                  <p className="font-light text-stone-500">{order.shippingAddress?.phone || order.user?.phone || 'Contact: N/A'}</p>
                </div>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Delivery Destination
                </h4>
                <div className="text-xs font-medium space-y-1 text-stone-850">
                  <p className="font-bold text-stone-900">{order.shippingAddress?.fullName}</p>
                  <p className="font-light leading-relaxed text-stone-600">
                    {order.shippingAddress?.street},<br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - <strong>{order.shippingAddress?.zipCode}</strong>
                  </p>
                  <p className="font-light text-stone-500">{order.shippingAddress?.country || 'India'}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5">Item Formulation</th>
                    <th className="py-2.5 text-center">Price</th>
                    <th className="py-2.5 text-center">Qty</th>
                    <th className="py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800 font-medium">
                  {order.orderItems?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3">
                        <p className="font-semibold text-stone-900">{item.title}</p>
                      </td>
                      <td className="py-3 text-center font-sans">
                        ₹{item.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right font-bold text-stone-900 font-sans">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown Summary */}
            <div className="flex justify-end pt-4 border-t border-stone-200">
              <div className="w-full sm:w-80 space-y-2 text-xs text-stone-650 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-sans">₹{getSubtotal().toLocaleString('en-IN')}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Coupon Discount</span>
                    <span className="font-sans">-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Delivery Fee</span>
                  <span className="font-sans">
                    {order.shippingPrice === 0 ? (
                      <strong className="text-emerald-700 font-sans font-bold">FREE</strong>
                    ) : (
                      `₹${order.shippingPrice}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-primary pt-2.5 border-t border-stone-150">
                  <span>Grand Total (INR)</span>
                  <span className="text-base text-primary font-sans font-extrabold">
                    ₹{order.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Signature Footer Note */}
            <div className="pt-12 text-center border-t border-stone-100/60 no-print">
              <div className="inline-flex items-center gap-1.5 text-[10px] text-stone-400 font-medium tracking-wide">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                This is a computer generated invoice and requires no physical signature.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
