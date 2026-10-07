import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getWatchlist,
  addMovie,
  removeMovie,
  clearWatchlist
} from '../controllers/watchlistController.js';

const router = express.Router();

router.use(requireAuth);

router.route('/')
  .get(getWatchlist)
  .post(addMovie)
  .delete(clearWatchlist);

router.route('/:movieId')
  .delete(removeMovie);

export default router;
