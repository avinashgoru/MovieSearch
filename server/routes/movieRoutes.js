import express from 'express';
import {
  getTrending,
  getPopular,
  getTopRated,
  search,
  discover,
  getDetails,
  getGenres
} from '../controllers/movieController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const movieLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

router.use(movieLimiter);

router.get('/trending', getTrending);
router.get('/popular', getPopular);
router.get('/top-rated', getTopRated);
router.get('/search', search);
router.get('/discover', discover);
router.get('/genres', getGenres);
router.get('/:id', getDetails);

export default router;
