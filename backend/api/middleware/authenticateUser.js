import jwt from 'jsonwebtoken';
import { ROFUser } from "../models/userModel.js";





const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
    console.log(decoded);
    req.user = decoded; // Attach the decoded user info to the request
    
    console.log(req.user.id); // Log to ensure user ID is correctly passed
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};



export default authenticateUser;
