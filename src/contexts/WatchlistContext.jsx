import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as watchlistApi from '../services/watchlistApi';
import { useAuth } from './AuthContext';
import { getWatchlist as getLocalWatchlist, saveWatchlist as saveLocalWatchlist } from '../utils/watchlistStorage';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const migrationAttempted = useRef(false);

  const fetchWatchlist = useCallback(async () => {
    try {
      const data = await watchlistApi.getWatchlist();
      setWatchlist(data.watchlist || []);
      return data.watchlist || [];
    } catch (error) {
      console.error('Failed to fetch watchlist from server:', error);
      return null;
    }
  }, []);

  const migrateLocalStorage = useCallback(async (serverWatchlist) => {
    if (migrationAttempted.current) return;
    const migratedFlag = localStorage.getItem('cinema_archive_watchlist_migrated');
    if (migratedFlag === 'true') return;

    migrationAttempted.current = true;
    
    const localMovies = getLocalWatchlist();
    if (localMovies.length === 0) {
      // Nothing to migrate
      localStorage.setItem('cinema_archive_watchlist_migrated', 'true');
      return;
    }

    try {
      // Identify movies not yet on the server
      const missingMovies = localMovies.filter(localMovie => 
        !serverWatchlist.some(serverMovie => String(serverMovie.id) === String(localMovie.id))
      );

      if (missingMovies.length > 0) {
        // Sequentially migrate to avoid overwhelming the server
        for (const movie of missingMovies) {
          try {
            await watchlistApi.addToWatchlist(movie);
          } catch (err) {
            console.error('Failed to migrate movie:', movie.id, err);
          }
        }
      }

      // Mark complete and clear old storage safely
      localStorage.setItem('cinema_archive_watchlist_migrated', 'true');
      saveLocalWatchlist([]);
      
      // Refetch to ensure we have the authoritative ordered list from server
      await fetchWatchlist();
    } catch (error) {
      console.error('Migration failed completely, will retry later:', error);
    }
  }, [fetchWatchlist]);

  // Handle auth state changes
  useEffect(() => {
    let mounted = true;

    const initWatchlist = async () => {
      if (authLoading) return;

      if (!isAuthenticated) {
        setWatchlist([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const serverData = await fetchWatchlist();
      
      if (mounted && serverData) {
        // Attempt migration safely
        await migrateLocalStorage(serverData);
      }
      
      if (mounted) {
        setIsLoading(false);
      }
    };

    initWatchlist();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, authLoading, fetchWatchlist, migrateLocalStorage]);

  const addMovie = useCallback(async (movie) => {
    if (!isAuthenticated) return;
    
    // Optimistic Update
    setWatchlist(prev => {
      if (prev.some(m => String(m.id) === String(movie.id))) return prev;
      return [{ ...movie, addedAt: Date.now() }, ...prev];
    });
    
    setIsUpdating(true);
    try {
      await watchlistApi.addToWatchlist(movie);
      // Wait for server state to become authoritative, but skip to keep UI fast
    } catch (error) {
      console.error('Failed to add movie:', error);
      // Rollback
      await fetchWatchlist();
    } finally {
      setIsUpdating(false);
    }
  }, [isAuthenticated, fetchWatchlist]);

  const removeMovie = useCallback(async (movieId) => {
    if (!isAuthenticated) return;

    // Optimistic Update
    setWatchlist(prev => prev.filter(m => String(m.id) !== String(movieId)));
    
    setIsUpdating(true);
    try {
      await watchlistApi.removeFromWatchlist(movieId);
    } catch (error) {
      console.error('Failed to remove movie:', error);
      // Rollback
      await fetchWatchlist();
    } finally {
      setIsUpdating(false);
    }
  }, [isAuthenticated, fetchWatchlist]);

  const toggleMovie = useCallback((movie) => {
    if (watchlist.some(m => String(m.id) === String(movie.id))) {
      removeMovie(movie.id);
    } else {
      addMovie(movie);
    }
  }, [watchlist, addMovie, removeMovie]);

  const clear = useCallback(async () => {
    if (!isAuthenticated) return;

    // Optimistic
    setWatchlist([]);
    setIsUpdating(true);
    
    try {
      await watchlistApi.clearWatchlist();
    } catch (error) {
      console.error('Failed to clear watchlist:', error);
      // Rollback
      await fetchWatchlist();
    } finally {
      setIsUpdating(false);
    }
  }, [isAuthenticated, fetchWatchlist]);

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
      isInWatchlist,
      isLoading,
      isUpdating
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
