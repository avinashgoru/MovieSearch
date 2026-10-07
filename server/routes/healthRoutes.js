import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  const status = isDbConnected ? 200 : 503;
  
  res.status(status).json({
    status: isDbConnected ? 'ok' : 'degraded',
    message: isDbConnected ? 'Cinema Archive API is running' : 'Service is temporarily unavailable',
    database: isDbConnected ? 'connected' : 'disconnected'
  });
});

export default router;
