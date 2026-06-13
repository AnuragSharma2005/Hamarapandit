import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const connUri = process.env.MONGO_URI || 'mongodb+srv://adityasharma5672_db_user:aditya_sharma@cctv.ua9ppeq.mongodb.net/astrology?retryWrites=true&w=majority&appName=cctv';

const gurus = [
  {
    name: 'Pandit Anurag Sharma',
    email: 'astrologer@kaaldarshan.com',
    password: 'password',
    role: 'astrologer',
    specialization: 'Vedic Horoscope & Dasha Expert',
    bio: 'Acharya resides with decades of wisdom, focusing on Vedic horoscope charts, Dasha analysis, and planetary transit remedies. Highly trusted for complex family and career path decodes.',
    experience: '15+ Years',
    rating: '4.9',
    languages: 'Hindi, English, Sanskrit',
    skills: ['Horoscope Reading', 'Lagna Chart', 'Dasha Remedies', 'Karma Healing']
  },
  {
    name: 'Dr. Ramesh Shastri',
    email: 'ramesh@kaaldarshan.com',
    password: 'password',
    role: 'astrologer',
    specialization: 'Marriage Compatibility Specialist',
    bio: 'Specializes in Kundali Milan, Manglik dosha remedies, and marital harmony calculations. Offers compassionate guidance on relations, marriages, and compatibility matrices.',
    experience: '14+ Years',
    rating: '4.8',
    languages: 'Hindi, Punjabi, English',
    skills: ['Kundali Milan', 'Love Relations', 'Manglik Dosha', 'Lal Kitab']
  }
];

async function run() {
  try {
    await mongoose.connect(connUri);
    console.log('Connected to Atlas MongoDB');

    for (const guru of gurus) {
      const existing = await User.findOne({ email: guru.email });
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(guru.password, salt);

      if (!existing) {
        const newGuru = await User.create({
          ...guru,
          password: hashedPassword
        });
        console.log(`Created Guru: ${newGuru.name}`);
      } else {
        // Update details to make sure they are correct and have role 'astrologer'
        existing.name = guru.name;
        existing.role = 'astrologer';
        existing.specialization = guru.specialization;
        existing.bio = guru.bio;
        existing.experience = guru.experience;
        existing.rating = guru.rating;
        existing.languages = guru.languages;
        existing.skills = guru.skills;
        await existing.save();
        console.log(`Updated Guru: ${existing.name}`);
      }
    }

    await mongoose.connection.close();
    console.log('Done database seeding.');
  } catch (err) {
    console.error('ERROR SEEDING:', err);
  }
}

run();
