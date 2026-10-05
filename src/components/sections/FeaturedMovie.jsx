import { Link } from 'react-router-dom';
import { BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Container from '../ui/Container';
import Badge from '../ui/Badge';
import { useWatchlist } from '../../contexts/WatchlistContext';
import { cn } from '../../utils/cn';

const FeaturedMovie = ({ movie }) => {
  const { isInWatchlist, toggleMovie } = useWatchlist();
  const saved = isInWatchlist(movie.id);

  return (
    <section className="relative w-full overflow-hidden bg-surface-elevated min-h-[70vh] md:min-h-[85vh] flex items-end pb-12 md:pb-24 pt-32">
      {/* Background Image with Overlays */}
      <div className="absolute inset-0">
        <motion.img 
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={movie.backdrop || movie.poster} 
          alt={movie.title} 
          fetchpriority="high"
          className="w-full h-full object-cover mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent opacity-90 md:opacity-70" />
      </div>

      <Container className="relative z-10 w-full">
        <div className="flex flex-col items-start max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[10px] text-accent uppercase tracking-widest border-l-2 border-accent pl-3">
                Featured / Archive
              </span>
              <span className="font-mono text-[10px] text-secondary uppercase tracking-widest">
                Vol. {new Date().getMonth() + 1}
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary leading-[0.95] tracking-tight mb-6 md:mb-8">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-8">
              {movie.rating && (
                <Badge variant="accent">TMDB {movie.rating}</Badge>
              )}
              {movie.releaseYear && (
                <span className="font-mono text-xs uppercase tracking-widest text-primary/80">{movie.releaseYear}</span>
              )}
              {movie.duration && (
                <>
                  <span className="text-border">·</span>
                  <span className="font-mono text-xs uppercase tracking-widest text-primary/80">{movie.duration}</span>
                </>
              )}
              {movie.genres?.length > 0 && (
                <>
                  <span className="text-border hidden md:inline">·</span>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map(g => (
                      <Badge key={g} variant="ghost" className="border-border/50 text-secondary">{g}</Badge>
                    ))}
                  </div>
                </>
              )}
            </div>

            <p className="font-sans text-primary/85 text-base md:text-xl max-w-2xl leading-relaxed line-clamp-3 md:line-clamp-4 mb-10">
              {movie.overview}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Button as={Link} to={`/movie/${movie.id}`} variant="primary" className="w-full sm:w-auto px-10">
                VIEW FILM
              </Button>
              <Button 
                onClick={() => toggleMovie(movie)}
                variant="secondary"
                className={cn("w-full sm:w-auto px-8 flex items-center justify-center gap-2 border-border/50 transition-colors", saved && "bg-surface-elevated text-accent")}
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
      </Container>
    </section>
  );
};

export default FeaturedMovie;
