import mongoose from 'mongoose';
import dotenv from 'dotenv';

// We need to call dotenv.config() here as well
// to make sure process.env.MONGO_URI is loaded
dotenv.config();

const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If successful, log the host
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If an error occurs, log the error and exit the server
    console.error(`Error: ${error.message}`);
    // Exit the process with failure (1)
    process.exit(1);
  }
};

export default connectDB;