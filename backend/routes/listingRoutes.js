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


// --- @desc:    Get all listings with pagination
// --- @route:   GET /api/listings?page=1&limit=12
// --- @access:  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Find listings with pagination, only fetch required fields
    const listings = await Listing.find({})
      .select('cropName quantity status harvestDate location_district createdAt user')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name')
      .lean(); // Use lean() for faster read-only queries

    // Get total count for pagination info
    const total = await Listing.countDocuments({});

    res.status(200).json({
      success: true,
      data: listings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;