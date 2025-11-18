import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js'; // <-- 1. IMPORT INQUIRY ROUTES
import statsRoutes from './routes/statsRoutes.js'; // <-- 1. IMPORT

// ... (dotenv.config() and connectDB() are here) ...
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ... (GET '/' route) ...
app.get('/', (req, res) => {
  res.send('Agri-connect API is running...');
});

// --- Mount Routes ---
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/inquiries', inquiryRoutes); // <-- 2. MOUNT THE ROUTES
app.use('/api/stats', statsRoutes); // <-- 2. MOUNT HERE

// ... (Error handling and app.listen() are here) ...
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});