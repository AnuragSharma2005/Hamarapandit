import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const connectDB = async () => {
  const connUri = process.env.MONGO_URI || 'mongodb://localhost:27017/kaal_darshan';
  try {
    const conn = await mongoose.connect(connUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-seed default credentials if they don't exist
    const astrologerExists = await User.findOne({ email: 'astrologer@kaaldarshan.com' });
    if (!astrologerExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password', salt);
      await User.create({
        name: 'Pandit Aditya Sharma',
        email: 'astrologer@kaaldarshan.com',
        password: hashedPassword,
        role: 'astrologer'
      });
      console.log('Default astrologer account seeded: astrologer@kaaldarshan.com / password');
    }

    const clientExists = await User.findOne({ email: 'client@kaaldarshan.com' });
    if (!clientExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password', salt);
      await User.create({
        name: 'Aditya Sharma',
        email: 'client@kaaldarshan.com',
        password: hashedPassword,
        role: 'client'
      });
      console.log('Default client account seeded: client@kaaldarshan.com / password');
    }
  } catch (error) {
    console.error(`MongoDB Connection Warning: Could not connect to database at ${connUri}. Please ensure MongoDB is running. Error: ${error.message}`);
  }
};

export default connectDB;
