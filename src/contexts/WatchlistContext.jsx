import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getWatchlist, 
  addToWatchlist, 
  removeFromWatchlist, 
  clearWatchlist 
} from '../utils/watchlistStorage';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);

  // Load initial watchlist
  useEffect(() => {
    setWatchlist(getWatchlist());

    // Listen for storage changes across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'kino-archive-watchlist') {
        setWatchlist(getWatchlist());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addMovie = useCallback((movie) => {
    const updated = addToWatchlist(movie);
    setWatchlist(updated);
  }, []);

  const removeMovie = useCallback((movieId) => {
    const updated = removeFromWatchlist(movieId);
    setWatchlist(updated);
  }, []);

  const toggleMovie = useCallback((movie) => {
    if (watchlist.some(m => String(m.id) === String(movie.id))) {
      removeMovie(movie.id);
    } else {
      addMovie(movie);
    }
  }, [watchlist, addMovie, removeMovie]);

  const clear = useCallback(() => {
    const updated = clearWatchlist();
    setWatchlist(updated);
  }, []);

  const isInWatchlist = useCallback((movieId) => {
    return watchlist.some(m => String(m.id) === String(movieId));
  }, [watchlist]);

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      addMovie,
      removeMovie,
      toggleMovie,
      clear,
      isInWatchlist
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
