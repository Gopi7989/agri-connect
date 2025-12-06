import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    // Link to the specific listing this message is about
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Listing',
    },
    // Link to the buyer who is sending the message
    from_buyer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Link to the farmer who owns the listing
    to_farmer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    message: {
      type: String,
      // Made optional because a structured offer might be enough
      required: false, 
    },
    
    // --- NEW FIELDS FOR BIDDING SYSTEM ---
    offerPrice: {
      type: Number, // The price the buyer is offering (e.g., 40 per kg)
    },
    offerQuantity: {
      type: String, // The amount they want (e.g., "200kg")
    },
    bidStatus: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'], // Tracks the deal status
      default: 'pending',
    },
    // -------------------------------------

    // We can add a field to track if the farmer has seen it
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;