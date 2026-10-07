import * as tmdbService from '../services/tmdbService.js';

export const getTrending = async (req, res, next) => {
  try {
    const data = await tmdbService.getTrendingMovies();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getPopular = async (req, res, next) => {
  try {
    const data = await tmdbService.getPopularMovies();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getTopRated = async (req, res, next) => {
  try {
    const data = await tmdbService.getTopRatedMovies();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const search = async (req, res, next) => {
  try {
    const { query, page } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query parameter is required' });
    }
    const data = await tmdbService.searchMovies(query, parseInt(page) || 1);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const discover = async (req, res, next) => {
  try {
    const { page, sort, genre, year, rating } = req.query;
    const filters = { page, sort, genre, year, rating };
    const data = await tmdbService.discoverMovies(filters);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Movie ID is required' });
    }
    const data = await tmdbService.getMovieDetails(id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getGenres = async (req, res, next) => {
  try {
    const data = await tmdbService.fetchGenres();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
