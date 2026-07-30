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
    benefits: '',
    howToUse: '',
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
      benefits: '',
      howToUse: '',
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
      benefits: p.benefits ? p.benefits.join(', ') : '',
      howToUse: p.howToUse || '',
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
        ingredients: form.ingredients ? form.ingredients.split(',').map((i) => i.trim()).filter(Boolean) : [],
        benefits: form.benefits ? form.benefits.split(',').map((b) => b.trim()).filter(Boolean) : [],
        howToUse: form.howToUse
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-sans">Inventory & Product Manager</h1>
          <p className="text-xs text-stone-500 font-medium">Create, edit, and control luxury store items.</p>
        </div>

        <button
          onClick={handleAddNewClick}
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
                  <td className="py-3 px-4 font-bold text-primary text-sans">
                    {p.discountPrice && p.discountPrice < p.price ? (
                      <div className="flex flex-col font-sans">
                        <span>₹{p.discountPrice}</span>
                        <span className="text-[10px] text-stone-400 line-through">₹{p.price}</span>
                      </div>
                    ) : (
                      <span>₹{p.price}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.stock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {p.stock} in stock
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-500">{p.category?.name || 'Botanical'}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="p-1 px-1.5 text-stone-500 hover:text-primary hover:bg-stone-50 rounded-lg inline-block"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      className="p-1 px-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg inline-block"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-lg font-bold">
                {isEditing ? 'Edit Luxury Product' : 'Add Luxury Product'}
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
                  placeholder="e.g. Velvet Jasmine & Wild Almond Body Butter"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Subtitle / Variant Name</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full bg-stone-50 border p-2.5 rounded-xl focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Rich Whipped Skin Nourishing Butter"
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
                    placeholder="e.g. 1800"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                    className="w-full bg-stone-50 border p-2.5 rounded-xl focus:ring-1 focus:ring-primary"
                    placeholder="e.g. 1550"
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
                    placeholder="e.g. 200g / 7.0 oz"
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
                  placeholder="e.g. Shea Butter, Mogra Jasmine Distillate, Almond Oil"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Benefits (comma-separated)</label>
                <input
                  type="text"
                  value={form.benefits}
                  onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                  className="w-full bg-stone-50 border p-2.5 rounded-xl focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Softens dry spots, Deep hydration, Enhances natural glow"
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

              <div>
                <label className="block text-stone-600 mb-1">How To Use</label>
                <textarea
                  rows="3"
                  value={form.howToUse}
                  onChange={(e) => setForm({ ...form, howToUse: e.target.value })}
                  className="w-full bg-stone-50 border p-2.5 rounded-xl focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Apply liberally over damp body post-bath. Pay special attention to elbows, knees, and heels."
                />
              </div>

              <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark">
                {isEditing ? 'Update Product' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
