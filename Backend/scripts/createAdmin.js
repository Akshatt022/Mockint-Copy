const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { adminModel } = require('../models/admin');
require('dotenv').config();

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGOURI || 'mongodb+srv://akshatsingh22032004:mockint1234@mockintcluster0.vw8lp37.mongodb.net/');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({ email: 'admin@mockint.com' });
    if (existingAdmin) {
      console.log('❌ Admin already exists with email: admin@mockint.com');
      process.exit(0);
    }

    // Create default admin
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    const admin = new adminModel({
      name: 'System Administrator',
      email: 'admin@mockint.com',
      password: hashedPassword,
      role: 'superadmin'
    });

    await admin.save();
    console.log('✅ Default admin created successfully!');
    console.log('📧 Email: admin@mockint.com');
    console.log('🔐 Password: Admin123!');
    console.log('⚠️  Please change the password after first login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createDefaultAdmin();