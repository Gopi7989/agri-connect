import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// This middleware will protect our routes
const protect = async (req, res, next) => {
  let token;

  // 1. Check if the 'Authorization' header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Get the token from the header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1]; // Get the part *after* "Bearer "

      // 3. Verify the token using our JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. If valid, get the user's ID from the token (the 'userId' we put in it)
      // We then find the user in the DB and attach them to the 'req' object
      // We exclude the password from the user object
      req.user = await User.findById(decoded.userId).select('-password');

      // 5. Call 'next()' to move on to the actual route (e.g., getProfile)
      next();
    } catch (error) {
      console.error(error);
      res.status(401); // 401 = Unauthorized
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

export { protect };