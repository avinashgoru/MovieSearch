import mongoose from 'mongoose';

export const requireDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database service is temporarily unavailable.'
    });
  }
  next();
};
