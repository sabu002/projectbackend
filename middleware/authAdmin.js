import jwt from 'jsonwebtoken';

export const authAdmin = (req, res, next) => {
  try {
    const token = req.cookies.admintoken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Not an admin' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Admin Token Verification Error:', error.message);
    return res.status(403).json({ success: false, message: 'Invalid Token' });
  }
};
