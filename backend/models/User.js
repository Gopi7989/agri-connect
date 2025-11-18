import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
    },
    mobileNumber: {
      type: String,
      required: [true, 'Please provide your mobile number'],
      unique: true,
      // You can add a regex validator for mobile numbers here
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false, // Prevents password from being sent in queries
    },
    role: {
      type: String,
      enum: ['farmer', 'buyer'],
      required: [true, 'Please specify your role (farmer or buyer)'],
    },
    location_district: {
      type: String,
      required: [true, 'Please provide your district'],
    },
    location_village: {
      type: String,
      // This is not required, as a buyer might only provide a district
    },

    // --- Farmer-Only Fields ---
    mainCrops: {
      type: [String],
    },
    landSize: {
      type: String, // e.g., "5 Acres"
    },

    // --- Buyer-Only Fields ---
    companyName: {
      type: String,
    },
    interestedIn: {
      type: [String],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// This Mongoose "middleware" runs BEFORE a user is saved
userSchema.pre('save', async function (next) {
  // We only want to hash the password if it's new or being changed
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a "salt" and hash the password
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// This adds a custom method to the User model
// We'll use it in our login route to check the password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the model from the schema
const User = mongoose.model('User', userSchema);

export default User;