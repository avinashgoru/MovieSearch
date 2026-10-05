import { useState, useEffect } from 'react';
import { getTrendingMovies, getPopularMovies, getTopRatedMovies } from '../services/api';

export const useHomeMovies = () => {
  const [data, setData] = useState({
    trending: [],
    popular: [],
    topRated: [],
    featured: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchHomeData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const results = await Promise.allSettled([
          getTrendingMovies(controller.signal),
          getPopularMovies(controller.signal),
          getTopRatedMovies(controller.signal)
        ]);
        
        if (!isMounted) return;

        const trending = results[0].status === 'fulfilled' ? results[0].value : [];
        const popular = results[1].status === 'fulfilled' ? results[1].value : [];
        const topRated = results[2].status === 'fulfilled' ? results[2].value : [];

        if (trending.length === 0 && popular.length === 0 && topRated.length === 0) {
          throw new Error('The archive could not be loaded.');
        }

        // Find a suitable featured movie (prefer backdrops, title, overview, and poster)
        const candidates = [...trending, ...popular, ...topRated];
        const featured = candidates.find(m => m.backdrop && m.poster && m.overview && m.title) || candidates[0];
        
        setData({
          trending: trending.slice(0, 10), // Curated slice for Home
          popular: popular.slice(0, 10),
          topRated: topRated.slice(0, 10),
          featured
        });
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) setError(err.message || 'Failed to load movies.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchHomeData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return { ...data, isLoading, error };
};
