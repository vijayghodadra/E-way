import React, { useState } from 'react';
import { Tag, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const CouponsManager = () => {
  const [coupons, setCoupons] = useState([
    { code: 'LUXURY15', discountType: 'percentage', discountValue: 15, minimumPurchase: 2000, isActive: true },
    { code: 'WELCOME500', discountType: 'fixed', discountValue: 500, minimumPurchase: 2500, isActive: true }
  ]);

  const [code, setCode] = useState('');
  const [discountValue, setDiscountValue] = useState('');

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!code) return;

    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(
        '/api/v1/admin/coupons',
        {
          code: code.toUpperCase(),
          discountType: 'percentage',
          discountValue: Number(discountValue),
          minimumPurchase: 1500,
          expiryDate: new Date('2027-12-31')
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Coupon ${code.toUpperCase()} created!`);
      setCoupons([...coupons, { code: code.toUpperCase(), discountType: 'percentage', discountValue: Number(discountValue), minimumPurchase: 1500, isActive: true }]);
      setCode('');
      setDiscountValue('');
    } catch (err) {
      toast.error('Failed to create coupon');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl font-bold text-stone-900">Promotions & Coupons</h1>
        <p className="text-xs text-stone-500 font-medium">Create promotional vouchers and discount rules.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-6">
        <form onSubmit={handleCreateCoupon} className="flex flex-wrap gap-4 items-end text-xs font-medium">
          <div>
            <label className="block mb-1 font-bold">Coupon Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. SPRING20"
              required
              className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl uppercase font-bold"
            />
          </div>
          <div>
            <label className="block mb-1 font-bold">Discount (%)</label>
            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder="15"
              required
              className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl"
            />
          </div>
          <button type="submit" className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl hover:bg-primary-dark">
            Create Coupon
          </button>
        </form>

        <div className="overflow-x-auto pt-4 border-t">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b text-stone-500 uppercase">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min Spend</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium">
              {coupons.map((c, i) => (
                <tr key={i}>
                  <td className="py-3 px-4 font-bold text-primary flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> {c.code}
                  </td>
                  <td className="py-3 px-4">{c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}</td>
                  <td className="py-3 px-4">₹{c.minimumPurchase}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      Active
                    </span>
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

export default CouponsManager;
