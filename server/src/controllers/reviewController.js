const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc Get Reviews for Product
// @route GET /api/v1/reviews/product/:productId
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc Create Product Review
// @route POST /api/v1/reviews
const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      rating: Number(rating),
      comment
    });

    // Update Product average rating
    const allReviews = await Review.find({ product: productId });
    product.numReviews = allReviews.length;
    product.rating =
      allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

    await product.save();

    res.status(201).json({ success: true, message: 'Review added successfully', review });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProductReviews, createReview };
