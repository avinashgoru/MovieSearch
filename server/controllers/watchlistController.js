import * as watchlistService from '../services/watchlistService.js';

export const getWatchlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const watchlist = await watchlistService.getUserWatchlist(userId);
    res.json({ success: true, watchlist });
  } catch (error) {
    next(error);
  }
};

export const addMovie = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { movieId, title, poster, backdrop, overview, releaseDate, releaseYear, rating, voteCount, genres, duration } = req.body;
    
    if (!movieId || !title) {
      return res.status(400).json({ success: false, message: 'movieId and title are required' });
    }

    const movieData = {
      movieId: Number(movieId),
      title,
      poster,
      backdrop,
      overview,
      releaseDate,
      releaseYear,
      rating,
      voteCount,
      genres,
      duration
    };

    const movie = await watchlistService.addMovieToWatchlist(userId, movieData);
    res.status(201).json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

export const removeMovie = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { movieId } = req.params;
    
    if (!movieId) {
      return res.status(400).json({ success: false, message: 'movieId is required' });
    }

    await watchlistService.removeMovieFromWatchlist(userId, Number(movieId));
    res.json({ success: true, message: 'Movie removed from watchlist.' });
  } catch (error) {
    next(error);
  }
};

export const clearWatchlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const count = await watchlistService.clearUserWatchlist(userId);
    res.json({ success: true, message: `Cleared ${count} movies from watchlist.` });
  } catch (error) {
    next(error);
  }
};
