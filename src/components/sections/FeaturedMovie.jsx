import { Link } from 'react-router-dom';
import { BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import MovieMeta from '../movie/MovieMeta';
import MoviePoster from '../movie/MoviePoster';
import Button from '../ui/Button';
import Container from '../ui/Container';
import { useWatchlist } from '../../contexts/WatchlistContext';
import { cn } from '../../utils/cn';

const FeaturedMovie = ({ movie }) => {
  const { isInWatchlist, toggleMovie } = useWatchlist();
  const saved = isInWatchlist(movie.id);

  return (
    <section className="relative w-full overflow-hidden bg-surface-elevated md:min-h-[85vh] flex items-center pt-8 md:pt-0">
      {/* Background Image with Overlays */}
      <div className="absolute inset-0">
        <motion.img 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={movie.backdrop || movie.poster} 
          alt={movie.title} 
          className="w-full h-full object-cover mix-blend-luminosity opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent opacity-90" />
      </div>

      <Container className="relative z-10 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-10 md:gap-16 lg:gap-24">
          
          {/* Mobile & Desktop Poster */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-3/5 max-w-[220px] md:w-1/3 md:max-w-xs lg:w-1/4 flex-shrink-0 mx-auto md:mx-0 shadow-2xl shadow-black border border-border/50"
          >
            <MoviePoster src={movie.poster} alt={movie.title} className="w-full" />
          </motion.div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest border border-accent/30 bg-accent/5 px-2 py-1 rounded-sm">
                  Weekend Edition
                </span>
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest border-l border-border pl-3">
                  Vol. 1
                </span>
              </div>

              <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary leading-[0.9] tracking-tight mb-6 md:mb-8">
                {movie.title}
              </h2>

              <MovieMeta 
                year={movie.releaseYear}
                duration={movie.duration}
                genres={movie.genres}
                rating={movie.rating}
                className="text-primary/90 justify-center md:justify-start mb-8 text-sm md:text-base border-b border-border/50 pb-6"
              />

              <p className="font-sans text-secondary text-base md:text-lg max-w-2xl leading-relaxed line-clamp-4 mb-10">
                {movie.overview}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start w-full sm:w-auto">
                <Button as={Link} to={`/movie/${movie.id}`} variant="primary" className="w-full sm:w-auto px-8">
                  VIEW FILM
                </Button>
                <Button 
                  onClick={() => toggleMovie(movie)}
                  variant="secondary"
                  className={cn("w-full sm:w-auto px-6 flex items-center justify-center gap-2", saved && "bg-surface-elevated text-accent border-accent/30")}
                >
                  {saved ? (
                    <>
                      <BookmarkCheck className="w-4 h-4" />
                      IN WATCHLIST
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4" />
                      ADD TO WATCHLIST
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedMovie;
