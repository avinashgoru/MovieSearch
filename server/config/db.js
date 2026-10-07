import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing from backend environment configuration.');
    process.exit(1);
  }

  try {
    mongoose.connection.on('connected', () => console.log('MongoDB connected'));
    mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));
    mongoose.connection.on('error', (err) => console.error(`MongoDB connection event error: ${err.name}`));

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    console.error('MongoDB connection error:');
    console.error(`${error.name}: ${error.message}`);
    if (error.code) console.error(`Code: ${error.code}`);
    if (error.codeName) console.error(`CodeName: ${error.codeName}`);
    console.error('MongoDB startup connection failed. Check your database configuration.');
    process.exit(1);
  }
};

export default connectDB;
