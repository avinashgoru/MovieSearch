import express from 'express';
import * as recentlyViewedController from '../controllers/recentlyViewedController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

router.get('/', recentlyViewedController.getHistory);
router.post('/', recentlyViewedController.recordMovie);
router.delete('/', recentlyViewedController.clearHistory);

export default router;
