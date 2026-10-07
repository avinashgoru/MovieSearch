import * as recommendationService from '../services/recommendationService.js';

export const getRecommendations = async (req, res, next) => {
  try {
    const { movies, reason } = await recommendationService.getRecommendations(req.user._id);
    res.json({
      success: true,
      movies,
      reason
    });
  } catch (error) {
    next(error);
  }
};
