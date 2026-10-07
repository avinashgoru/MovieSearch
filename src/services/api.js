const API_BASE_URL = '/api/movies';

const fetchApi = async (endpoint, params = {}, signal) => {
  const queryParams = new URLSearchParams();
  
  // Safely encode all params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  const url = queryString ? `${API_BASE_URL}${endpoint}?${queryString}` : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, { signal });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Record not found.');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      } else if (response.status >= 500) {
        throw new Error('Unable to retrieve the requested archive. Service is currently unavailable.');
      }
      throw new Error(data.message || 'An error occurred while fetching data.');
    }

    return data.data; // Backend wraps data in { success: true, data: ... }
  } catch (error) {
    // Rethrow standard app-level errors for hooks to catch
    if (error.name === 'AbortError') {
      throw error;
    }
    throw error;
  }
};

export const getTrendingMovies = async (signal) => {
  const data = await fetchApi('/trending', {}, signal);
  // The backend returns { movies, page, totalPages, totalResults }
  // Existing hooks expect an array for trending, popular, and topRated
  return data.movies || [];
};

export const getPopularMovies = async (signal) => {
  const data = await fetchApi('/popular', {}, signal);
  return data.movies || [];
};

export const getTopRatedMovies = async (signal) => {
  const data = await fetchApi('/top-rated', {}, signal);
  return data.movies || [];
};

export const searchMovies = async (query, page = 1, signal) => {
  if (!query) return { results: [], totalPages: 0, totalResults: 0, page: 1 };
  
  const data = await fetchApi('/search', { query, page }, signal);
  // The backend returns { movies, page, totalPages, totalResults }
  // The frontend Search expects { results, page, totalPages, totalResults }
  return {
    results: data.movies || [],
    totalPages: data.totalPages || 0,
    totalResults: data.totalResults || 0,
    page: data.page || 1
  };
};

export const discoverMovies = async (filters = {}, signal) => {
  const data = await fetchApi('/discover', filters, signal);
  return {
    results: data.movies || [],
    totalPages: data.totalPages || 0,
    totalResults: data.totalResults || 0,
    page: data.page || 1
  };
};

export const getMovieDetails = async (movieId, signal) => {
  const data = await fetchApi(`/${movieId}`, {}, signal);
  // Backend returns normalized movie object directly
  return data;
};

export const fetchGenres = async (signal) => {
  const data = await fetchApi('/genres', {}, signal);
  return data; // Returns the genre map directly
};
