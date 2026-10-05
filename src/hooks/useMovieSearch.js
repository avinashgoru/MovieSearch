import { useState, useEffect } from 'react';
import { searchMovies } from '../services/api';

export const useMovieSearch = (query, page = 1) => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ totalPages: 0, totalResults: 0 });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        setPagination({ totalPages: 0, totalResults: 0 });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await searchMovies(query, page, controller.signal);
        if (isMounted) {
          setResults(data.results);
          setPagination({ totalPages: data.totalPages, totalResults: data.totalResults });
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) setError(err.message || 'Failed to search movies.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSearch();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [query, page]);

  return { results, isLoading, error, ...pagination };
};
