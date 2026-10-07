import Watchlist from '../models/Watchlist.js';

export const getUserWatchlist = async (userId) => {
  const watchlist = await Watchlist.find({ userId }).sort({ createdAt: -1 });
  // Map back to the expected frontend shape (id instead of movieId, or leave as is if frontend adapts)
  // We'll return the raw objects, but transform `movieId` to `id` just for convenience so frontend doesn't need to change much
  return watchlist.map(item => {
    const obj = item.toObject();
    return {
      ...obj,
      id: obj.movieId // alias for frontend compatibility
    };
  });
};

export const addMovieToWatchlist = async (userId, movieData) => {
  try {
    // Upsert or just create. Unique index will prevent duplicates.
    // If it exists, we could just return the existing one.
    const existing = await Watchlist.findOne({ userId, movieId: movieData.movieId });
    if (existing) {
      const obj = existing.toObject();
      return { ...obj, id: obj.movieId };
    }

    const newMovie = await Watchlist.create({
      userId,
      ...movieData
    });
    
    const obj = newMovie.toObject();
    return { ...obj, id: obj.movieId };
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error, fetch existing
      const existing = await Watchlist.findOne({ userId, movieId: movieData.movieId });
      const obj = existing.toObject();
      return { ...obj, id: obj.movieId };
    }
    throw error;
  }
};

export const removeMovieFromWatchlist = async (userId, movieId) => {
  await Watchlist.findOneAndDelete({ userId, movieId });
  return true;
};

export const clearUserWatchlist = async (userId) => {
  const result = await Watchlist.deleteMany({ userId });
  return result.deletedCount;
};
