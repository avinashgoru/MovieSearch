import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookmarkPlus, BookmarkCheck } from 'lucide-react';
import MoviePoster from './MoviePoster';
import MovieMeta from './MovieMeta';
import Badge from '../ui/Badge';
import { useWatchlist } from '../../contexts/WatchlistContext';

const MovieCard = ({ movie }) => {
  const { isInWatchlist, toggleMovie } = useWatchlist();
  const saved = isInWatchlist(movie.id);

  return (
    <Link to={`/movie/${movie.id}`} className="block group">
      <motion.div
        whileHover="hover"
        initial="initial"
        className="relative flex flex-col gap-4"
      >
        <div className="relative overflow-hidden rounded-sm">
          {movie.tags && movie.tags.length > 0 && (
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
              {movie.tags.map(tag => (
                <Badge key={tag} variant="default" className="bg-background/80 backdrop-blur-sm border-transparent text-primary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleMovie(movie);
              }}
              className="bg-background/80 backdrop-blur-sm border border-border/50 text-primary p-1.5 rounded-sm hover:bg-accent hover:text-background hover:border-transparent transition-all"
              aria-label={saved ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
            </button>
          </div>
          
          <motion.div
            variants={{
              initial: { scale: 1 },
              hover: { scale: 1.05 }
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <MoviePoster 
              src={movie.poster} 
              alt={movie.title}
              aspectRatio="portrait"
            />
          </motion.div>

          <motion.div 
            variants={{
              initial: { opacity: 0 },
              hover: { opacity: 1 }
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-background/20 mix-blend-overlay pointer-events-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="font-display text-2xl text-primary leading-tight group-hover:text-accent transition-colors line-clamp-2" title={movie.title}>
            {movie.title}
          </h3>
          <MovieMeta 
            year={movie.releaseYear}
            duration={movie.duration}
            genres={movie.genres}
            rating={movie.rating}
          />
        </div>
      </motion.div>
    </Link>
  );
};

export default MovieCard;
