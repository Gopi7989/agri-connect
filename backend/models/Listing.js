import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    // This creates a direct link to the User model.
    // It's how we know *which* farmer posted this listing.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This tells Mongoose to link to the 'User' collection
    },
    cropName: {
      type: String,
      required: [true, 'Please enter the crop name'],
      index: true, // Index for faster filtering
    },
    quantity: {
      type: String,
      required: [true, 'Please enter the quantity (e.g., 500kg, 10 quintals)'],
    },
    status: {
      type: String,
      required: true,
      enum: ['Available Now', 'Expected Harvest'], // Only allows these two values
      default: 'Available Now',
      index: true, // Index for faster filtering
    },
    harvestDate: {
      // This is optional, for "Expected Harvest"
      type: Date,
    },
    // We copy the district here for easier and faster searching/filtering
    // in the marketplace.
    location_district: {
      type: String,
      required: true,
      index: true, // Index for faster search
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Compound index for common search patterns
listingSchema.index({ createdAt: -1 }); // Index for sorting by newest
listingSchema.index({ cropName: 1, location_district: 1 }); // Compound index for search

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;