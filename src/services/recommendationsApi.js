const API_URL = '/api/recommendations';

export const getRecommendations = async (signal) => {
  const res = await fetch(API_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    signal,
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Not authenticated');
    throw new Error('Failed to fetch recommendations');
  }
  return res.json();
};
