import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Sparkles, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    price: '',
    discountPrice: '',
    stock: 50,
    category: '',
    image: '',
    description: '',
    ingredients: ''
  });

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image file size must be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/v1/products?limit=50');
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(
        '/api/v1/admin/products',
        {
          title: form.title,
          subtitle: form.subtitle,
          price: Number(form.price),
          discountPrice: Number(form.discountPrice || 0),
          stock: Number(form.stock),
          category: '65f12a3b4c5d6e7f8a9b0c1d', // default fallback category ID
          images: [form.image || 'https://images.unsplash.com/photo-1608248597560-8438b4562c55?auto=format&fit=crop&q=80&w=800'],
          description: form.description,
          ingredients: form.ingredients.split(',')
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Product created successfully!');
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to create product');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-stone-900">Inventory & Product Manager</h1>
          <p className="text-xs text-stone-500 font-medium">Create, edit, and control luxury store items.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-dark transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Botanical Item
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by title..."
            className="w-full bg-stone-50 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-stone-200"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-stone-50">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={p.images?.[0]} alt={p.title} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-stone-900">{p.title}</p>
                      <span className="text-[10px] text-stone-400">{p.subtitle}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-primary">₹{p.price?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.stock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {p.stock} in stock
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-500">{p.category?.name || 'Botanical'}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-1 text-stone-500 hover:text-primary">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Product */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-playfair text-lg font-bold">Add Luxury Product</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full bg-stone-50 p-2.5 rounded-xl border"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    className="w-full bg-stone-50 p-2.5 rounded-xl border"
                  />
                </div>
                <div>
                  <label className="block mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required
                    className="w-full bg-stone-50 p-2.5 rounded-xl border"
                  />
                </div>
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Product Image (Select from Gallery / Device)
                </label>
                <div className="relative border-2 border-dashed border-stone-300 hover:border-emerald-800 bg-stone-50 rounded-2xl p-4 text-center transition-all cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {form.image ? (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={form.image}
                        alt="Selected Preview"
                        className="w-24 h-24 object-cover rounded-xl border-2 border-emerald-800 shadow-sm"
                      />
                      <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> Tap to change image from gallery
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5 py-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-900/10 text-emerald-900 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-stone-800">
                        Choose Image from Mobile Gallery / Device
                      </p>
                      <p className="text-[10px] text-stone-500">
                        PNG, JPG, WEBP formats supported
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-stone-50 p-2.5 rounded-xl border"
                />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold">
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
