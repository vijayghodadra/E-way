const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc Get Products with filtering, search, pagination & sorting
// @route GET /api/v1/products
const getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, rating, sort, page = 1, limit = 12 } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      const catDoc = await Category.findOne({ slug: category });
      if (catDoc) {
        query.category = catDoc._id;
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    let sortOptions = {};
    if (sort === 'price-low') sortOptions.price = 1;
    else if (sort === 'price-high') sortOptions.price = -1;
    else if (sort === 'rating') sortOptions.rating = -1;
    else if (sort === 'newest') sortOptions.createdAt = -1;
    else sortOptions.createdAt = -1; // default newest

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get Featured Products
// @route GET /api/v1/products/featured
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .populate('category', 'name slug')
      .limit(8);
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc Get Best Seller Products
// @route GET /api/v1/products/bestsellers
const getBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find({ isBestSeller: true })
      .populate('category', 'name slug')
      .limit(8);
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc Get Single Product by Slug or ID
// @route GET /api/v1/products/:slug
const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      $or: [{ slug: req.params.slug }, { _id: req.params.slug.match(/^[0-9a-fA-F]{24}$/) ? req.params.slug : null }]
    }).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Related products in same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id }
    })
      .limit(4)
      .populate('category', 'name slug');

    res.json({ success: true, product, relatedProducts });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getBestSellers,
  getProductBySlug
};
