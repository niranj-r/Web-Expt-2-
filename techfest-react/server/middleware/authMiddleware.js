import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - User must be authenticated
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'techfest_super_secret_jwt_key_2026_hash';
      const decoded = jwt.verify(token, secret);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User account not found' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Optional protect middleware (if token present, attaches user; if not, continues as guest)
export const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'techfest_super_secret_jwt_key_2026_hash';
      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Ignore token failure for optional protect
    }
  }
  next();
};

// Organizer / Admin role check
export const organizerOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'organizer' || req.user.role === 'admin')) {
    return next();
  } else {
    return res.status(403).json({ success: false, message: 'Access denied. Organizer privileges required.' });
  }
};
