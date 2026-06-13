import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const connectDB = async () => {
  const connUri = process.env.MONGO_URI || 'mongodb://localhost:27017/AstrologyCRM';
  try {
    const conn = await mongoose.connect(connUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-seed default credentials if they don't exist
    const astrologerExists = await User.findOne({ email: 'astrologer@astrologycrm.com' });
    if (!astrologerExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password', salt);
      await User.create({
        name: 'Pandit Anurag Sharma',
        email: 'astrologer@astrologycrm.com',
        password: hashedPassword,
        role: 'astrologer'
      });
      console.log('Default astrologer account seeded: astrologer@astrologycrm.com / password');
    }

    const clientExists = await User.findOne({ email: 'client@astrologycrm.com' });
    if (!clientExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password', salt);
      await User.create({
        name: 'Anurag Sharma',
        email: 'client@astrologycrm.com',
        password: hashedPassword,
        role: 'client'
      });
      console.log('Default client account seeded: client@astrologycrm.com / password');
    }
  } catch (error) {
    console.error(`MongoDB Connection Warning: Could not connect to database at ${connUri}. Please ensure MongoDB is running. Error: ${error.message}`);
  }
};

export default connectDB;
