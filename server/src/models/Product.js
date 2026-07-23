const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    sku: { type: String, required: true, unique: true },
    subtitle: { type: String, default: '' },
    brand: { type: String, default: 'Élixir Botanicals' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 50 },
    images: [{ type: String, required: true }],
    videoUrl: { type: String, default: '' },
    description: { type: String, required: true },
    ingredients: [{ type: String }],
    benefits: [{ type: String }],
    howToUse: { type: String, default: '' },
    volume: { type: String, default: '50ml / 1.7 fl oz' },
    skinType: { type: String, default: 'All Skin Types' },
    rating: { type: Number, default: 4.8 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
