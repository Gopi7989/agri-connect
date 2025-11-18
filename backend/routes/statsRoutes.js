import express from 'express';
import User from '../models/User.js';
import Listing from '../models/Listing.js';

const router = express.Router();

// --- @route:   GET /api/stats
// --- @access:  Public
router.get('/', async (req, res) => {
  try {
    // 1. Count total farmers
    const farmerCount = await User.countDocuments({ role: 'farmer' });

    // 2. Count total active listings
    const listingCount = await Listing.countDocuments({});

    // 3. Count unique districts (from listings)
    const districts = await Listing.distinct('location_district');
    const districtCount = districts.length;

    res.status(200).json({
      farmers: farmerCount,
      listings: listingCount,
      districts: districtCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;