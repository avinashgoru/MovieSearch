import { useState, useEffect } from 'react';
import { fetchGenres } from '../services/api';

export const useGenres = () => {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadGenres = async () => {
      try {
        const genreMap = await fetchGenres();
        if (isMounted) {
          // Convert map { id: name } back to array [{ id, name }] and sort alphabetically
          const genreArray = Object.entries(genreMap)
            .map(([id, name]) => ({ id: Number(id), name }))
            .sort((a, b) => a.name.localeCompare(b.name));
          setGenres(genreArray);
        }
      } catch (error) {
        console.error('Failed to load genres in hook', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadGenres();
    return () => {
      isMounted = false;
    };
  }, []);

  return { genres, isLoading };
};
