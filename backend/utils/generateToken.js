import jwt from 'jsonwebtoken';

// This function creates the signed JWT
const generateToken = (userId) => {
  // 'sign' takes 3 arguments:
  // 1. The payload (what data we want to store in the token)
  // 2. The secret (from our .env file)
  // 3. Options (like when it expires)
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Expires in 30 days
  });
};

export default generateToken;