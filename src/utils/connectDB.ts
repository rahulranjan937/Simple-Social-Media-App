import mongoose from 'mongoose';
import { MONGODB_URI, NODE_ENV } from '@config';

if (NODE_ENV !== 'production') {
  mongoose.set('debug', true);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI as string);

    console.log('MongoDB connected...');
  } catch (err: any) {
    console.error(err.message);
    setTimeout(() => {
      console.log('Trying to reconnect to MongoDB...');
      connectDB();
    }, 5000);
  }
};

export { connectDB };
