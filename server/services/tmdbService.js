import dotenv from 'dotenv';
dotenv.config();

const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

const getApiKey = () => {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error('API key is missing. Please add TMDB_API_KEY to your .env file.');
  }
  return key;
};

let genreCache = {};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}${size}${path}`;
};

const fetchApi = async (endpoint, params = {}) => {
  const queryParams = new URLSearchParams({
    api_key: getApiKey(),
    language: 'en-US',
    ...params,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}?${queryParams.toString()}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key: You must be granted a valid key.');
      }
      throw new Error(data.status_message || 'An error occurred while fetching data from TMDB.');
    }

    return data;
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('Upstream request timed out.');
    }
    throw error;
  }
};

export const fetchGenres = async () => {
  if (Object.keys(genreCache).length > 0) return genreCache;
  
  try {
    const data = await fetchApi('/genre/movie/list');
    const genreMap = {};
    data.genres.forEach(g => {
      genreMap[g.id] = g.name;
    });
    genreCache = genreMap;
    return genreMap;
  } catch (error) {
    console.error('Failed to fetch genres from TMDB:', error);
    return {};
  }
};

const normalizeMovie = (movie, genresMap = {}) => {
  return {
    id: movie.id,
    title: movie.title || movie.name,
    overview: movie.overview,
    poster: getImageUrl(movie.poster_path, 'w500'),
    backdrop: getImageUrl(movie.backdrop_path, 'w1280'),
    releaseDate: movie.release_date,
    releaseYear: movie.release_date ? movie.release_date.split('-')[0] : null,
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : null,
    voteCount: movie.vote_count,
    genres: movie.genres 
      ? movie.genres.map(g => g.name)
      : (movie.genre_ids ? movie.genre_ids.map(id => genresMap[id]).filter(Boolean) : []),
    duration: movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null,
    originalLanguage: movie.original_language || null,
    status: movie.status || null,
    featured: false,
    tags: []
  };
};

export const getTrendingMovies = async () => {
  const [data, genresMap] = await Promise.all([
    fetchApi('/trending/movie/day'),
    fetchGenres()
  ]);
  return {
    movies: data.results.map(m => normalizeMovie(m, genresMap)),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results
  };
};

export const getPopularMovies = async () => {
  const [data, genresMap] = await Promise.all([
    fetchApi('/movie/popular'),
    fetchGenres()
  ]);
  return {
    movies: data.results.map(m => normalizeMovie(m, genresMap)),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results
  };
};

export const getTopRatedMovies = async () => {
  const [data, genresMap] = await Promise.all([
    fetchApi('/movie/top_rated'),
    fetchGenres()
  ]);
  return {
    movies: data.results.map(m => normalizeMovie(m, genresMap)),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results
  };
};

export const searchMovies = async (query, page = 1) => {
  if (!query) return { movies: [], totalPages: 0, totalResults: 0, page: 1 };
  
  const [data, genresMap] = await Promise.all([
    fetchApi('/search/movie', { query, page }),
    fetchGenres()
  ]);
  
  return {
    movies: data.results.map(m => normalizeMovie(m, genresMap)),
    totalPages: data.total_pages,
    totalResults: data.total_results,
    page: data.page
  };
};

export const discoverMovies = async (filters = {}) => {
  const params = {
    page: filters.page || 1,
    sort_by: filters.sort || 'popularity.desc',
  };
  
  if (filters.genre) params.with_genres = filters.genre;
  if (filters.year) params.primary_release_year = filters.year;
  if (filters.rating) params['vote_average.gte'] = filters.rating;

  const [data, genresMap] = await Promise.all([
    fetchApi('/discover/movie', params),
    fetchGenres()
  ]);
  
  return {
    movies: data.results.map(m => normalizeMovie(m, genresMap)),
    totalPages: data.total_pages,
    totalResults: data.total_results,
    page: data.page
  };
};

export const getMovieDetails = async (movieId) => {
  const data = await fetchApi(`/movie/${movieId}`, {
    append_to_response: 'credits,similar'
  });
  
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
