import * as recentlyViewedService from '../services/recentlyViewedService.js';

export const getHistory = async (req, res, next) => {
  try {
    const history = await recentlyViewedService.getRecentlyViewed(req.user._id);
    res.json({
      success: true,
      history
    });
  } catch (error) {
    next(error);
  }
};

export const recordMovie = async (req, res, next) => {
  try {
    const { movieId, title, poster, backdrop, rating, releaseYear, genres } = req.body;
    
    if (!movieId || !title) {
      const error = new Error('movieId and title are required');
      error.statusCode = 400;
      throw error;
    }

    const movieData = {
      movieId: Number(movieId),
      title,
      poster,
      backdrop,
      rating: rating ? Number(rating) : undefined,
      releaseYear: releaseYear ? Number(releaseYear) : undefined,
      genres: Array.isArray(genres) ? genres : []
    };

    const record = await recentlyViewedService.recordView(req.user._id, movieData);
    
    res.status(200).json({
      success: true,
      record
    });
  } catch (error) {
    next(error);
  }
};

export const clearHistory = async (req, res, next) => {
  try {
    await recentlyViewedService.clearRecentlyViewed(req.user._id);
    res.json({
      success: true,
      message: 'History cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};
