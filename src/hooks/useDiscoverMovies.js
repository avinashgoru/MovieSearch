import { useState, useEffect } from 'react';
import { discoverMovies } from '../services/api';

export const useDiscoverMovies = (filters) => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ totalPages: 0, totalResults: 0 });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchDiscover = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await discoverMovies(filters, controller.signal);
        if (isMounted) {
          setResults(data.results);
          setPagination({ totalPages: data.totalPages, totalResults: data.totalResults });
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) setError(err.message || 'Failed to discover movies.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDiscover();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [filters.page, filters.sort, filters.genre, filters.year, filters.rating]);

  return { results, isLoading, error, ...pagination };
};
