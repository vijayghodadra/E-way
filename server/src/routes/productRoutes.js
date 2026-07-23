const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getBestSellers,
  getProductBySlug
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestSellers);
router.get('/:slug', getProductBySlug);

module.exports = router;
