const Razorpay = require('razorpay');

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret || key_id.includes('mockkey')) {
    return null;
  }

  try {
    return new Razorpay({
      key_id,
      key_secret
    });
  } catch (err) {
    console.error('[Razorpay Error]: Failed to instantiate Razorpay client:', err.message);
    return null;
  }
};

module.exports = getRazorpayInstance;
