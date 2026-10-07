import express from 'express';
import * as recommendationController from '../controllers/recommendationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', recommendationController.getRecommendations);

export default router;
