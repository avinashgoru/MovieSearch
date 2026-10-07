import { useState, useEffect } from 'react';
import { getRecommendations } from '../services/recommendationsApi';
import { useAuth } from '../contexts/AuthContext';

export const useRecommendations = () => {
  const { isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setRecommendations([]);
      setReason('');
      return;
    }

    const abortController = new AbortController();
    let isMounted = true;

    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getRecommendations(abortController.signal);
        if (isMounted) {
          setRecommendations(data.movies || []);
          setReason(data.reason || '');
        }
      } catch (err) {
        if (!abortController.signal.aborted && isMounted) {
          setError(err.message || 'Failed to load recommendations');
          setRecommendations([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRecommendations();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [isAuthenticated]);

  return {
    recommendations,
    reason,
    isLoading,
    error
  };
};
