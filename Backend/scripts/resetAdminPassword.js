require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { adminModel } = require('../models/admin');

const resetAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGOURI || 'mongodb://localhost:27017/mockint');
    console.log('✅ Connected to MongoDB');

    // Find admin
    const admin = await adminModel.findOne({ email: 'admin@mockint.com' });
    
    if (!admin) {
      console.log('❌ Admin not found');
      process.exit(1);
    }

    // Reset password
    const newPassword = 'Admin123!';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    admin.password = hashedPassword;
    await admin.save();
    
    console.log('✅ Admin password reset successfully');
    console.log('📧 Email: admin@mockint.com');
    console.log('🔑 Password: Admin123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetAdminPassword();