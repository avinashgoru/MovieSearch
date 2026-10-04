import { useState, useEffect } from 'react';
import { getMovieDetails } from '../services/api';

export const useMovieDetails = (id) => {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      setMovie(null); // Clear previous

      try {
        const data = await getMovieDetails(id);
        if (isMounted) {
          setMovie(data);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load movie details.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { movie, isLoading, error };
};
