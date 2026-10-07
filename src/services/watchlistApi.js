const API_URL = '/api/watchlist';

export const getWatchlist = async () => {
  const res = await fetch(API_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Not authenticated');
    throw new Error('Failed to fetch watchlist');
  }
  return res.json();
};

export const addToWatchlist = async (movie) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster,
      backdrop: movie.backdrop,
      overview: movie.overview,
      releaseDate: movie.releaseDate,
      releaseYear: movie.releaseYear,
      rating: movie.rating,
      voteCount: movie.voteCount,
      genres: movie.genres,
      duration: movie.duration
    }),
  });
  if (!res.ok) {
    throw new Error('Failed to add movie to watchlist');
  }
  return res.json();
};

export const removeFromWatchlist = async (movieId) => {
  const res = await fetch(`${API_URL}/${movieId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to remove movie from watchlist');
  }
  return res.json();
};

export const clearWatchlist = async () => {
  const res = await fetch(API_URL, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to clear watchlist');
  }
  return res.json();
};
