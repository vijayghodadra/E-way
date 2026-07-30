const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eway_luxury_db';

const updateAdmin = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB...');

    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.findOne({ email: 'admin@Earthora.com' });
    }
    if (!admin) {
      admin = await User.findOne({ email: 'admin@elixirbotanicals.com' });
    }

    if (admin) {
      admin.name = 'Earthora Admin Master';
      admin.email = 'admin@earthora.com';
      admin.password = 'adminearthora123';
      await admin.save();
      console.log('Admin user updated successfully.');
    } else {
      admin = await User.create({
        name: 'Earthora Admin Master',
        email: 'admin@earthora.com',
        role: 'admin',
        password: 'adminearthora123',
        phone: '+91 97777 55555'
      });
      console.log('Created fresh Admin user.');
    }

    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Update error:', error);
    process.exit(1);
  }
};

updateAdmin();
