import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as recentlyViewedApi from '../services/recentlyViewedApi';

export const useRecentlyViewed = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const abortController = new AbortController();
    let isMounted = true;

    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await recentlyViewedApi.getRecentlyViewed(abortController.signal);
        if (isMounted && data.success) {
          // Normalize the _id -> id to match TMDB movie shape where possible
          const normalizedHistory = data.history.map(item => ({
            ...item,
            id: item.movieId, // Use id instead of movieId for standard components
          }));
          setHistory(normalizedHistory);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) {
          setError(err.message || 'Failed to fetch history');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [user]);

  const clearHistory = async () => {
    try {
      await recentlyViewedApi.clearRecentlyViewed();
      setHistory([]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { history, isLoading, error, clearHistory };
};
