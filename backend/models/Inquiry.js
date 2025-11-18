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
      required: [true, 'Please enter your message'],
    },
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