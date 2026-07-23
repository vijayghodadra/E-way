const Razorpay = require('razorpay');

let razorpayInstance = null;

try {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey12345678';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'mocksecret1234567890';

  razorpayInstance = new Razorpay({
    key_id,
    key_secret
  });
} catch (err) {
  console.warn('[Razorpay Warning]: Razorpay initialization skipped due to missing keys. Mock fallback active.');
}

module.exports = razorpayInstance;
