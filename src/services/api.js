const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// Local cache for genres to avoid repeated fetching
let genreCache = {};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}${size}${path}`;
};

const fetchApi = async (endpoint, params = {}, signal) => {
  if (!API_KEY) {
    throw new Error('API key is missing. Please add VITE_TMDB_API_KEY to your .env file.');
  }

  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
    ...params,
  });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}?${queryParams.toString()}`, { signal });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key: You must be granted a valid key.');
      }
      throw new Error(data.status_message || 'An error occurred while fetching data from TMDB.');
    }

    return data;
  } catch (error) {
    // Re-throw to be handled by the hooks
    throw error;
  }
};

export const fetchGenres = async (signal) => {
  if (Object.keys(genreCache).length > 0) return genreCache;
  
  try {
    const data = await fetchApi('/genre/movie/list', {}, signal);
    const genreMap = {};
    data.genres.forEach(g => {
      genreMap[g.id] = g.name;
    });
    genreCache = genreMap;
    return genreMap;
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    return {};
  }
};

const normalizeMovie = (movie, genresMap = {}) => {
  return {
    id: movie.id,
    title: movie.title || movie.name, // Handle some edge cases
    overview: movie.overview,
    poster: getImageUrl(movie.poster_path, 'w500'),
    backdrop: getImageUrl(movie.backdrop_path, 'w1280'),
    releaseDate: movie.release_date,
    releaseYear: movie.release_date ? movie.release_date.split('-')[0] : null,
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : null,
    voteCount: movie.vote_count,
    // If we have detailed genres (from details endpoint), use them directly
    genres: movie.genres 
      ? movie.genres.map(g => g.name)
      : (movie.genre_ids ? movie.genre_ids.map(id => genresMap[id]).filter(Boolean) : []),
    duration: movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null,
    originalLanguage: movie.original_language || null,
    status: movie.status || null,
    featured: false,
    tags: [] // Can be populated dynamically if needed
  };
};

export const getTrendingMovies = async (signal) => {
  const [data, genresMap] = await Promise.all([
    fetchApi('/trending/movie/day', {}, signal),
    fetchGenres(signal)
  ]);
  return data.results.map(m => normalizeMovie(m, genresMap));
};

export const getPopularMovies = async (signal) => {
  const [data, genresMap] = await Promise.all([
    fetchApi('/movie/popular', {}, signal),
    fetchGenres(signal)
  ]);
  return data.results.map(m => normalizeMovie(m, genresMap));
};

export const getTopRatedMovies = async (signal) => {
  const [data, genresMap] = await Promise.all([
    fetchApi('/movie/top_rated', {}, signal),
    fetchGenres(signal)
  ]);
  return data.results.map(m => normalizeMovie(m, genresMap));
};

export const searchMovies = async (query, page = 1, signal) => {
  if (!query) return { results: [], totalPages: 0, totalResults: 0 };
  
  const [data, genresMap] = await Promise.all([
    fetchApi('/search/movie', { query, page }, signal),
    fetchGenres()
  ]);
  
  return {
    results: data.results.map(m => normalizeMovie(m, genresMap)),
    totalPages: data.total_pages,
    totalResults: data.total_results,
    page: data.page
  };
};

export const discoverMovies = async (filters = {}, signal) => {
  const params = {
    page: filters.page || 1,
    sort_by: filters.sort || 'popularity.desc',
  };
  
  if (filters.genre) params.with_genres = filters.genre;
  if (filters.year) params.primary_release_year = filters.year;
  if (filters.rating) params['vote_average.gte'] = filters.rating;

  const [data, genresMap] = await Promise.all([
    fetchApi('/discover/movie', params, signal),
    fetchGenres()
  ]);
  
  return {
    results: data.results.map(m => normalizeMovie(m, genresMap)),
    totalPages: data.total_pages,
    totalResults: data.total_results,
    page: data.page
  };
};

export const getMovieDetails = async (movieId, signal) => {
  const data = await fetchApi(`/movie/${movieId}`, {
    append_to_response: 'credits,similar'
  }, signal);
  
  const normalized = normalizeMovie(data);
  
  const writers = data.credits?.crew?.filter(c => c.department === 'Writing' || c.job === 'Screenplay' || c.job === 'Writer') || [];
  const uniqueWriters = Array.from(new Set(writers.map(w => w.name))).slice(0, 3);
  
  return {
    ...normalized,
    cast: data.credits?.cast?.slice(0, 10).map(c => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile: getImageUrl(c.profile_path, 'w185')
    })) || [],
    director: data.credits?.crew?.find(c => c.job === 'Director')?.name || null,
    writers: uniqueWriters,
    similar: data.similar?.results?.slice(0, 10).map(m => normalizeMovie(m, genreCache)) || []
  };
};
