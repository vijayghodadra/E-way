import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    price: '',
    discountPrice: '',
    stock: 50,
    category: '',
    image: '',
    description: '',
    ingredients: '',
    volume: '50ml / 1.7 fl oz',
    rating: 4.8,
    numReviews: 0,
    isBestSeller: false,
    isNewArrival: false,
    isFeatured: false
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

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/v1/categories');
      const cats = res.data.categories || [];
      setCategoriesList(cats);
      if (cats.length && !form.category) {
        setForm((prev) => ({ ...prev, category: cats[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      const fallback = [
        { _id: '65f12a3b4c5d6e7f8a9b0c1d', name: 'Botanical Skincare' },
        { _id: '65f12a3b4c5d6e7f8a9b0c2d', name: 'Herbal Hair Care' },
        { _id: '65f12a3b4c5d6e7f8a9b0c3d', name: 'Artisanal Body Care' },
        { _id: '65f12a3b4c5d6e7f8a9b0c4d', name: 'Aromatherapy & Wellness' }
      ];
      setCategoriesList(fallback);
      if (!form.category) {
        setForm((prev) => ({ ...prev, category: fallback[0]._id }));
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleAddNewClick = () => {
    setIsEditing(false);
    setEditId(null);
    setForm({
      title: '',
      subtitle: '',
      price: '',
      discountPrice: '',
      stock: 50,
      category: categoriesList[0]?._id || '',
      image: '',
      description: '',
      ingredients: '',
      volume: '50ml / 1.7 fl oz',
      rating: 4.8,
      numReviews: 0,
      isBestSeller: false,
      isNewArrival: false,
      isFeatured: false
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (p) => {
    setIsEditing(true);
    setEditId(p._id);
    setForm({
      title: p.title || '',
      subtitle: p.subtitle || '',
      price: p.price || '',
      discountPrice: p.discountPrice || '',
      stock: p.stock || 50,
      category: p.category?._id || p.category || '',
      image: p.images?.[0] || '',
      description: p.description || '',
      ingredients: p.ingredients ? p.ingredients.join(', ') : '',
      volume: p.volume || '50ml / 1.7 fl oz',
      rating: p.rating || 4.8,
      numReviews: p.numReviews || 0,
      isBestSeller: !!p.isBestSeller,
      isNewArrival: !!p.isNewArrival,
      isFeatured: !!p.isFeatured
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice || form.price),
        stock: Number(form.stock),
        rating: Number(form.rating || 4.8),
        numReviews: Number(form.numReviews || 0),
        images: [form.image || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800'],
        ingredients: form.ingredients ? form.ingredients.split(',').map((i) => i.trim()).filter(Boolean) : []
      };

      if (isEditing) {
        await axios.put(
          `/api/v1/admin/products/${editId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Product updated successfully!');
      } else {
        await axios.post(
          '/api/v1/admin/products',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Product created successfully!');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(isEditing ? 'Failed to update product' : 'Failed to create product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`/api/v1/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Product deleted!');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Products & Inventory Control</h1>
          <p className="text-xs text-stone-500 font-medium">Manage formulations, pricing, stock levels, and store listings.</p>
        </div>

        <button
          onClick={handleAddNewClick}
          className="bg-amber-400 text-stone-950 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-amber-300 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Formulation
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4">
        <div className="relative max-w-sm">
          <input
            type="text"
            placeholder="Search formulations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-stone-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-stone-700 font-medium">
              {filteredProducts.map((prod) => (
                <tr key={prod._id} className="hover:bg-stone-50/80">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=200'}
                      alt={prod.title}
                      className="w-10 h-10 rounded-lg object-cover border"
                    />
                    <div>
                      <p className="font-semibold text-stone-900">{prod.title}</p>
                      <p className="text-[10px] text-stone-400">{prod.category?.name || 'General'}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-900 font-sans">
                    {prod.discountPrice && prod.discountPrice < prod.price ? (
                      <div className="flex flex-col">
                        <span>₹{prod.discountPrice}</span>
                        <span className="text-[10px] text-stone-400 line-through">₹{prod.price}</span>
                      </div>
                    ) : (
                      <span>₹{prod.price}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${prod.stock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {prod.stock} in stock
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(prod)}
                      className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg inline-block"
                      title="Edit Formulation"
                    >
                      <Edit className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod._id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg inline-block"
                      title="Delete Formulation"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-playfair text-lg font-bold">
                {isEditing ? 'Edit Botanical Product' : 'Add New Botanical Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="block text-stone-600 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-stone-50 border p-2.5 rounded-xl focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Rose & Vetiver Dew Drops Moisture Nectar"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Subtitle / Sub-header</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full bg-stone-50 border p-2.5 rounded-xl focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Hydrating Botanical Hydra-Gel Cream"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-stone-50 border p-2.5 rounded-xl font-semibold focus:outline-none"
                  required
                >
                  {categoriesList.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-stone-50 border p-2.5 rounded-xl focus:ring-1 focus:ring-primary"
                    placeholder="e.g. 2200"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                    className="w-full bg-stone-50 border p-2.5 rounded-xl focus:ring-1 focus:ring-primary"
                    placeholder="e.g. 1890"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full bg-stone-50 border p-2.5 rounded-xl focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Volume / Size Description</label>
                  <input
                    type="text"
                    required
                    value={form.volume}
                    onChange={(e) => setForm({ ...form, volume: e.target.value })}
                    className="w-full bg-stone-50 border p-2.5 rounded-xl focus:ring-1 focus:ring-primary"
                    placeholder="e.g. 50ml / 1.7 fl oz"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">Rating (1.0 to 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    required
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="w-full bg-stone-50 border p-2.5 rounded-xl focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Reviews Count</label>
                  <input
                    type="number"
                    required
                    value={form.numReviews}
                    onChange={(e) => setForm({ ...form, numReviews: e.target.value })}
                    className="w-full bg-stone-50 border p-2.5 rounded-xl focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <span className="block text-stone-600 mb-1">Tag Badges Overlay</span>
                <div className="flex gap-4 py-1.5 flex-wrap">
                  <label className="flex items-center gap-1.5 cursor-pointer text-stone-700">
                    <input
                      type="checkbox"
                      checked={form.isBestSeller}
                      onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-emerald-800"
                    />
                    <span>Best Seller Badge</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-stone-700">
                    <input
                      type="checkbox"
                      checked={form.isNewArrival}
                      onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-emerald-800"
                    />
                    <span>New Arrival Badge</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-stone-700">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-emerald-800"
                    />
                    <span>Featured Badge</span>
                  </label>
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
                <label className="block text-stone-600 mb-1">Ingredients (comma-separated)</label>
                <input
                  type="text"
                  value={form.ingredients}
                  onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                  className="w-full bg-stone-50 border p-2.5 rounded-xl focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Saffron, Mysore Sandalwood Extract, Lotus Oil"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-stone-50 border p-2.5 rounded-xl focus:ring-1 focus:ring-primary"
                  placeholder="Provide deep description of the item..."
                />
              </div>

              <button type="submit" className="w-full bg-emerald-900 text-white font-bold py-3 rounded-xl hover:bg-emerald-950">
                {isEditing ? 'Update formulation' : 'Save Formulation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
