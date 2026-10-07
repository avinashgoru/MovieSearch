import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler.js';
import healthRoutes from './routes/healthRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import recentlyViewedRoutes from './routes/recentlyViewedRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import { requireDb } from './middleware/dbCheck.js';

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser & Cookie parser
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', requireDb, authRoutes);
app.use('/api/watchlist', requireDb, watchlistRoutes);
app.use('/api/recently-viewed', requireDb, recentlyViewedRoutes);
app.use('/api/recommendations', requireDb, recommendationRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/movies', movieRoutes);

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// Production SPA routing
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

export default app;
