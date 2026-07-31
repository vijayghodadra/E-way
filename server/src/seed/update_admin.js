const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/earthora_luxury_db';

const updateAdmin = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB...');

    // Delete any existing admins to make sure we remove the old admin clean
    const deleteResult = await User.deleteMany({ role: 'admin' });
    console.log('Deleted old admin(s):', deleteResult.deletedCount);

    // Create the new admin with the requested credentials
    const admin = await User.create({
      name: 'Earthora Admin Master',
      email: 'admin@earthora.com',
      role: 'admin',
      password: 'admin@earthora123',
      phone: '+91 98765 43210'
    });
    console.log('Created new Admin user:', admin.email);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Update error:', error);
    process.exit(1);
  }
};

updateAdmin();
