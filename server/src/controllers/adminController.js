const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');

// Utility to parse financial year (1st April to 31st March)
const getFinancialYearDates = (fyString) => {
  if (!fyString || !/^\d{4}-\d{4}$/.test(fyString)) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed: 3 = April
    const startYear = month >= 3 ? year : year - 1;
    return {
      start: new Date(Date.UTC(startYear, 3, 1, 0, 0, 0, 0)),
      end: new Date(Date.UTC(startYear + 1, 2, 31, 23, 59, 59, 999))
    };
  }

  const [startYearStr] = fyString.split('-');
  const startYear = parseInt(startYearStr, 10);
  return {
    start: new Date(Date.UTC(startYear, 3, 1, 0, 0, 0, 0)),
    end: new Date(Date.UTC(startYear + 1, 2, 31, 23, 59, 59, 999))
  };
};

// @desc Get Dashboard Analytics Metrics
// @route GET /api/v1/admin/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const { start, end } = getFinancialYearDates(req.headers['x-financial-year']);
    const dateFilter = {
      createdAt: {
        $gte: start,
        $lte: end
      }
    };

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments(dateFilter);

    const orders = await Order.find({ isPaid: true, ...dateFilter });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    const recentOrders = await Order.find(dateFilter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    const lowStockProducts = await Product.find({ stock: { $lte: 10 } }).limit(5);

    // Calculate actual monthly sales aggregated for the selected financial year
    const monthlySales = {};
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    months.forEach(m => monthlySales[m] = 0);

    orders.forEach(o => {
      const date = new Date(o.createdAt);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const mName = monthNames[date.getMonth()];
      if (monthlySales[mName] !== undefined) {
        monthlySales[mName] += o.totalPrice;
      }
    });

    const salesChart = months.map(m => ({
      month: m,
      sales: Math.round(monthlySales[m])
    }));

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
    const { start, end } = getFinancialYearDates(req.headers['x-financial-year']);
    const dateFilter = {
      createdAt: {
        $gte: start,
        $lte: end
      }
    };
    const orders = await Order.find(dateFilter)
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

// @desc Edit Order Details (Admin)
// @route PUT /api/v1/admin/orders/:id
const updateOrderDetails = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (shippingAddress) {
      order.shippingAddress = {
        ...order.shippingAddress.toObject(),
        ...shippingAddress
      };
    }

    await order.save();
    
    // Populate user to match expected formats
    const updatedOrder = await Order.findById(order._id).populate('user', 'name email phone');
    
    res.json({ success: true, message: 'Order details updated successfully', order: updatedOrder });
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
  createCoupon,
  updateOrderDetails
};
