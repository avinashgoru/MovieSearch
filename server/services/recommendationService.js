import Watchlist from '../models/Watchlist.js';
import RecentlyViewed from '../models/RecentlyViewed.js';
import { discoverMovies, fetchGenres } from './tmdbService.js';

const calculateUserPreferences = async (userId) => {
  const [watchlist, history] = await Promise.all([
    Watchlist.find({ userId }),
    RecentlyViewed.find({ userId }).sort({ viewedAt: -1 }).limit(20)
  ]);

  const genreScores = {};

  // Weight history by recency (decay)
  const now = Date.now();
  history.forEach(movie => {
    if (!movie.genres) return;
    const viewedAt = movie.viewedAt ? new Date(movie.viewedAt).getTime() : now;
    const daysAgo = Math.max(0, (now - viewedAt) / (1000 * 60 * 60 * 24));
    // Simple decay: 1.0 today, decays by 0.05 per day, min 0.2
    const recencyWeight = Math.max(0.2, 1.0 - (daysAgo * 0.05));
    
    movie.genres.forEach(genre => {
      genreScores[genre] = (genreScores[genre] || 0) + recencyWeight;
    });
  });

  // Weight watchlist heavily as intentional interest (flat weight 1.5)
  watchlist.forEach(movie => {
    if (!movie.genres) return;
    movie.genres.forEach(genre => {
      genreScores[genre] = (genreScores[genre] || 0) + 1.5;
    });
  });

  return { genreScores, watchlist, history };
};

export const getRecommendations = async (userId) => {
  const { genreScores, watchlist, history } = await calculateUserPreferences(userId);

  const seenIds = new Set([
    ...watchlist.map(m => m.movieId),
    ...history.map(m => m.movieId)
  ]);

  // If no preferences, fallback to general popular/top rated logic
  // We can just query TMDB without genre filter but sorted by popularity
  if (Object.keys(genreScores).length === 0) {
    const fallbackData = await discoverMovies({ sort: 'popularity.desc' });
    const filteredFallback = fallbackData.movies.filter(m => !seenIds.has(m.id)).slice(0, 10);
    return {
      movies: filteredFallback,
      reason: 'Popular in the archive'
    };
  }

  // Get top 2 genres
  const sortedGenres = Object.entries(genreScores).sort((a, b) => b[1] - a[1]);
  const topGenreNames = sortedGenres.slice(0, 2).map(entry => entry[0]);

  // Fetch TMDB genres to map string to ID
  const tmdbGenresMap = await fetchGenres();
  // Reverse map
  const reverseGenreMap = {};
  for (const [id, name] of Object.entries(tmdbGenresMap)) {
    reverseGenreMap[name] = id;
  }

  const topGenreIds = topGenreNames.map(name => reverseGenreMap[name]).filter(Boolean);

  let candidates = [];
  
  if (topGenreIds.length > 0) {
    const discoverData = await discoverMovies({
      genre: topGenreIds.join('|'), // OR logic for genres to increase diversity
      sort: 'popularity.desc'
    });
    candidates = discoverData.movies;
  }

  // Score candidates
  const scoredCandidates = candidates.map(movie => {
    let score = 0;
    
    // Genre match
    if (movie.genres) {
      movie.genres.forEach(g => {
        if (genreScores[g]) score += genreScores[g];
      });
    }

    // Popularity bonus (small)
    if (movie.rating) {
      score += (Number(movie.rating) * 0.1);
    }

    return { ...movie, _score: score };
  });

  // Filter seen, sort by score descending, take top 10
  const recommendations = scoredCandidates
    .filter(m => !seenIds.has(m.id))
    .sort((a, b) => b._score - a._score)
    .slice(0, 10);

  // Remove internal score from output
  const cleanRecommendations = recommendations.map(m => {
    const cleanMovie = { ...m };
    delete cleanMovie._score;
    return cleanMovie;
  });

  let reason = 'Based on your recent screenings';
  if (topGenreNames.length > 0) {
    reason = `Because you explored ${topGenreNames.join(' and ')}`;
  }

  // Fallback if somehow empty after filtering
  if (cleanRecommendations.length === 0) {
    const fallbackData = await discoverMovies({ sort: 'popularity.desc' });
    const filteredFallback = fallbackData.movies.filter(m => !seenIds.has(m.id)).slice(0, 10);
    return {
      movies: filteredFallback,
      reason: 'Popular in the archive'
    };
  }

  return {
    movies: cleanRecommendations,
    reason
  };
};
