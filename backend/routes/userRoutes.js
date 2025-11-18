import express from 'express';
import User from '../models/User.js'; // Import our User model
import generateToken from '../utils/generateToken.js'; // Import our token generator
import { protect } from '../middleware/authMiddleware.js';

// 'express.Router()' is a mini-app that can handle its own routes
const router = express.Router();

// --- @desc:    Register a new user
// --- @route:   POST /api/users/register
// --- @access:  Public
router.post('/register', async (req, res) => {
  try {
    // 1. Get the data from the request body
    const { name, mobileNumber, password, role, location_district, mainCrops } =
      req.body;

    // 2. Check if the user (by mobile number) already exists
    const userExists = await User.findOne({ mobileNumber });

    if (userExists) {
      // 400 = Bad Request
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Create the new user in memory
    const user = await User.create({
      name,
      mobileNumber,
      password, // The password will be auto-hashed by our 'pre-save' hook in the model!
      role,
      location_district,
      mainCrops,
      // Add any other fields you need from the body
    });

    // 4. If user was created successfully
    if (user) {
      // 201 = Created
      res.status(201).json({
        _id: user._id,
        name: user.name,
        role: user.role,
        message: 'User registered successfully!',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    // 500 = Internal Server Error
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    // 1. Get mobileNumber and password from the request body
    const { mobileNumber, password } = req.body;

    // 2. Find the user in the database by their mobile number
    // We add .select('+password') because we set 'select: false' in our model
    const user = await User.findOne({ mobileNumber }).select('+password');

    // 3. Check if user exists AND if the password matches
    // We use our custom 'comparePassword' method from the User model
    if (user && (await user.comparePassword(password))) {
      // 4. If they match, send back the user's data and a token
      res.status(200).json({
        _id: user._id,
        name: user.name,
        mobileNumber: user.mobileNumber,
        role: user.role,
        token: generateToken(user._id), // Generate the key!
      });
    } else {
      // 401 = Unauthorized
      res.status(401).json({ message: 'Invalid mobile number or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// --- @desc:    Get user profile
// --- @route:   GET /api/users/profile
// --- @access:  Private (Requires Token)
router.get('/profile', protect, async (req, res) => {
  // 'protect' runs FIRST. If the token is valid,
  // it attaches the user's data to 'req.user'
  
  if (req.user) {
    // We can just send back the user data that the middleware found
    res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      mobileNumber: req.user.mobileNumber,
      role: req.user.role,
      location_district: req.user.location_district,
      mainCrops: req.user.mainCrops,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export default router;