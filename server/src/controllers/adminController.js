const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');

// @desc Get Dashboard Analytics Metrics
// @route GET /api/v1/admin/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    const lowStockProducts = await Product.find({ stock: { $lte: 10 } }).limit(5);

    // Sales data chart simulation
    const salesChart = [
      { month: 'Jan', sales: 42000 },
      { month: 'Feb', sales: 68000 },
      { month: 'Mar', sales: 95000 },
      { month: 'Apr', sales: 120000 },
      { month: 'May', sales: 185000 },
      { month: 'Jun', sales: 240000 }
    ];

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: Math.round(totalRevenue),
        recentOrders,
        lowStockProducts,
        salesChart
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create Product (Admin)
// @route POST /api/v1/admin/products
const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      sku,
      subtitle,
      brand,
      category,
      price,
      discountPrice,
      stock,
      images,
      description,
      ingredients,
      benefits,
      howToUse,
      volume,
      skinType,
      isFeatured,
      isBestSeller,
      isNewArrival
    } = req.body;

    const product = new Product({
      title,
      slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      sku: sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      subtitle,
      brand,
      category,
      price,
      discountPrice,
      stock,
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1608248597560-8438b4562c55?auto=format&fit=crop&q=80&w=800'],
      description,
      ingredients: Array.isArray(ingredients) ? ingredients : ingredients ? ingredients.split(',') : [],
      benefits: Array.isArray(benefits) ? benefits : benefits ? benefits.split(',') : [],
      howToUse,
      volume,
      skinType,
      isFeatured: !!isFeatured,
      isBestSeller: !!isBestSeller,
      isNewArrival: !!isNewArrival
    });

    const savedProduct = await product.save();
    res.status(201).json({ success: true, message: 'Product created successfully', product: savedProduct });
  } catch (error) {
    next(error);
  }
};

// @desc Update Product (Admin)
// @route PUT /api/v1/admin/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();

    res.json({ success: true, message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// @desc Delete Product (Admin)
// @route DELETE /api/v1/admin/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc Get All Orders (Admin)
// @route GET /api/v1/admin/orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc Update Order Status (Admin)
// @route PUT /api/v1/admin/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, trackingNumber, carrier } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = orderStatus || order.orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;

    if (orderStatus === 'Delivered') {
      order.deliveredAt = Date.now();
      if (order.paymentMethod === 'COD') {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
    }

    await order.save();
    res.json({ success: true, message: `Order status updated to ${order.orderStatus}`, order });
  } catch (error) {
    next(error);
  }
};

// @desc Create Coupon (Admin)
// @route POST /api/v1/admin/coupons
const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Coupon created successfully', coupon });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  createCoupon
};
