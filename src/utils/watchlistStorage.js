const STORAGE_KEY = 'kino-archive-watchlist';

export const getWatchlist = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    // Ensure it's an array
    if (!Array.isArray(parsed)) return [];
    
    // Ensure structure is somewhat valid (movies should have an id)
    return parsed.filter(movie => movie && typeof movie.id !== 'undefined');
  } catch (error) {
    console.error('Failed to parse watchlist from localStorage', error);
    return [];
  }
};

export const saveWatchlist = (watchlist) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  } catch (error) {
    console.error('Failed to save watchlist to localStorage', error);
  }
};

export const addToWatchlist = (movie) => {
  const current = getWatchlist();
  // Prevent duplicates
  if (current.some(m => String(m.id) === String(movie.id))) {
    return current;
  }
  // Store a lightweight version of the movie
  const lightweightMovie = {
    id: movie.id,
    title: movie.title,
    poster: movie.poster,
    backdrop: movie.backdrop,
    overview: movie.overview,
    releaseDate: movie.releaseDate,
    releaseYear: movie.releaseYear,
    rating: movie.rating,
    voteCount: movie.voteCount,
    genres: movie.genres,
    duration: movie.duration,
    addedAt: Date.now()
  };
  
  const updated = [lightweightMovie, ...current];
  saveWatchlist(updated);
  return updated;
};

export const removeFromWatchlist = (movieId) => {
  const current = getWatchlist();
  const updated = current.filter(m => String(m.id) !== String(movieId));
  saveWatchlist(updated);
  return updated;
};

export const clearWatchlist = () => {
  saveWatchlist([]);
  return [];
};
