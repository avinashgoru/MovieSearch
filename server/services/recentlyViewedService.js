import RecentlyViewed from '../models/RecentlyViewed.js';

const HISTORY_LIMIT = 20;

export const getRecentlyViewed = async (userId) => {
  return await RecentlyViewed.find({ userId })
    .sort({ viewedAt: -1 })
    .limit(HISTORY_LIMIT);
};

export const recordView = async (userId, movieData) => {
  // Upsert the movie view
  const record = await RecentlyViewed.findOneAndUpdate(
    { userId, movieId: movieData.movieId },
    {
      $set: {
        title: movieData.title,
        poster: movieData.poster,
        backdrop: movieData.backdrop,
        rating: movieData.rating,
        releaseYear: movieData.releaseYear,
        genres: movieData.genres,
        viewedAt: new Date()
      }
    },
    { upsert: true, returnDocument: 'after' }
  );

  // Enforce the 20-item limit
  // First, find all records for the user, sorted by viewedAt descending
  // We can skip the first 20 and delete the rest
  const recordsToKeep = await RecentlyViewed.find({ userId })
    .sort({ viewedAt: -1 })
    .select('_id')
    .limit(HISTORY_LIMIT);
  
  if (recordsToKeep.length === HISTORY_LIMIT) {
    const keepIds = recordsToKeep.map(r => r._id);
    await RecentlyViewed.deleteMany({
      userId,
      _id: { $nin: keepIds }
    });
  }

  return record;
};

export const clearRecentlyViewed = async (userId) => {
  return await RecentlyViewed.deleteMany({ userId });
};
