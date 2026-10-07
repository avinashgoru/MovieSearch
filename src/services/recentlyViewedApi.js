const API_URL = '/api/recently-viewed';

export const getRecentlyViewed = async (signal) => {
  const res = await fetch(API_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    signal,
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Not authenticated');
    throw new Error('Failed to fetch recently viewed');
  }
  return res.json();
};

export const addRecentlyViewed = async (movieData, signal) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(movieData),
    signal,
  });
  if (!res.ok) {
    throw new Error('Failed to record recently viewed');
  }
  return res.json();
};

export const clearRecentlyViewed = async (signal) => {
  const res = await fetch(API_URL, {
    method: 'DELETE',
    credentials: 'include',
    signal,
  });
  if (!res.ok) {
    throw new Error('Failed to clear recently viewed');
  }
  return res.json();
};
