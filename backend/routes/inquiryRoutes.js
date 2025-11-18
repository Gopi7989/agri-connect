import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // Import our "Token Checker"
import Inquiry from '../models/Inquiry.js'; // Import the Inquiry model
import Listing from '../models/Listing.js'; // Import the Listing model

const router = express.Router();

// --- @desc:    Send a new inquiry about a listing
// --- @route:   POST /api/inquiries
// --- @access:  Private (Buyers Only)
router.post('/', protect, async (req, res) => {
  try {
    // 1. Only allow users with the 'buyer' role to send inquiries
    if (req.user.role !== 'buyer') {
      return res.status(401).json({ message: 'Only buyers can send inquiries' });
    }

    // 2. Get the listing ID and message from the request body
    const { listingId, message } = req.body;

    // 3. Find the listing the buyer is asking about
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // 4. Create the new inquiry
    const inquiry = new Inquiry({
      listing: listingId,
      from_buyer: req.user._id, // The logged-in buyer
      to_farmer: listing.user, // The farmer who owns the listing
      message,
    });

    // 5. Save the inquiry to the database
    const createdInquiry = await inquiry.save();

    // 201 = Created
    res.status(201).json(createdInquiry);

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


// --- @desc:    Get all inquiries for the logged-in user (both sent and received)
// --- @route:   GET /api/inquiries/my-inquiries
// --- @access:  Private (Farmers & Buyers)
router.get('/my-inquiries', protect, async (req, res) => {
  try {
    // Find all inquiries where the logged-in user is EITHER the buyer OR the farmer
    const inquiries = await Inquiry.find({
      $or: [
        { from_buyer: req.user._id },
        { to_farmer: req.user._id }
      ]
    })
    .sort({ createdAt: -1 }) // Show newest first
    // Populate with useful data for the frontend
    .populate('listing', 'cropName') // Get the crop name from the listing
    .populate('from_buyer', 'name mobileNumber') // Get the buyer's name
    .populate('to_farmer', 'name mobileNumber');  // Get the farmer's name

    res.status(200).json(inquiries);

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;