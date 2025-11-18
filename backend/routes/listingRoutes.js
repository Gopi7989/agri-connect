import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // Import our "Token Checker"
import Listing from '../models/Listing.js'; // Import the Listing model

const router = express.Router();

// --- @desc:    Create a new listing
// --- @route:   POST /api/listings
// --- @access:  Private (Requires Token)
router.post('/', protect, async (req, res) => {
  try {
    // 1. Get the data from the request body
    const { cropName, quantity, status, harvestDate } = req.body;

    // 2. 'protect' middleware already gave us 'req.user'
    // We can now create the new listing and link it to the user
    const listing = new Listing({
      cropName,
      quantity,
      status,
      harvestDate,
      user: req.user._id, // Link to the logged-in farmer
      location_district: req.user.location_district, // Copy district from user
    });

    // 3. Save the new listing to the database
    const createdListing = await listing.save();
    
    // 201 = Created
    res.status(201).json(createdListing);

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


// --- @desc:    Get all listings
// --- @route:   GET /api/listings
// --- @access:  Public
router.get('/', async (req, res) => {
  try {
    // Find all listings and sort them by 'createdAt' (newest first)
    // We also 'populate' the 'user' field
    // This replaces the user's ID with their name from the User collection
    const listings = await Listing.find({}).sort({ createdAt: -1 }).populate('user', 'name');

    res.status(200).json(listings);

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;