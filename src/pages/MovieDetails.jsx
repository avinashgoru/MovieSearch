import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { BookmarkPlus, BookmarkCheck, ArrowLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Container from '../components/ui/Container';
import MoviePoster from '../components/movie/MoviePoster';
import MovieGrid from '../components/movie/MovieGrid';
import MovieCard from '../components/movie/MovieCard';
import SectionHeading from '../components/sections/SectionHeading';
import Button from '../components/ui/Button';
import { DetailsSkeleton } from '../components/ui/LoadingSkeletons';
import { useMovieDetails } from '../hooks/useMovieDetails';
import { useWatchlist } from '../contexts/WatchlistContext';
import { cn } from '../utils/cn';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, isLoading, error } = useMovieDetails(id);
  const { isInWatchlist, toggleMovie } = useWatchlist();
  
  const saved = movie ? isInWatchlist(movie.id) : false;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: `Check out ${movie.title} on Kino Archive.`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed silently
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (error || !movie) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <p className="font-mono text-sm text-accent uppercase tracking-widest mb-4">Record Not Found</p>
        <p className="text-secondary mb-8">{error || 'This film could not be retrieved from the archive.'}</p>
        <Button onClick={() => navigate(-1)} variant="secondary">Return</Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col pb-32 bg-background"
    >
      {/* Back Navigation Bar */}
      <div className="absolute top-16 left-0 right-0 z-40 bg-gradient-to-b from-background/80 to-transparent pt-6 pb-12 pointer-events-none">
        <Container>
          <button 
            onClick={() => navigate(-1)}
            className="pointer-events-auto flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary/70 hover:text-accent transition-colors mix-blend-difference"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </Container>
      </div>

      {/* Cinematic Hero Backdrop */}
      <div className="relative w-full h-[60vh] md:h-[75vh] bg-surface-elevated overflow-hidden">
        {movie.backdrop ? (
          <motion.img 
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src={movie.backdrop} 
            alt={movie.title} 
            className="w-full h-full object-cover mix-blend-luminosity" 
          />
        ) : (
          <div className="w-full h-full bg-surface-elevated border-b border-border/20" />
        )}
        
        {/* Gradients to blend image into background */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent opacity-80 md:opacity-50" />
      </div>

      <Container className="relative -mt-48 md:-mt-64 z-10">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-24">
          
          {/* Left Column: Poster & Quick Actions */}
          <div className="w-1/2 max-w-[240px] md:w-1/3 md:max-w-xs lg:w-1/4 flex-shrink-0 flex flex-col gap-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <MoviePoster 
                src={movie.poster} 
                alt={movie.title} 
                className="w-full shadow-2xl shadow-black/80 ring-1 ring-border/20" 
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden md:flex flex-col gap-3"
            >
              <Button 
                onClick={() => toggleMovie(movie)}
                variant={saved ? "secondary" : "primary"}
                className={cn("w-full flex items-center justify-center gap-2", saved && "bg-surface-elevated border-border")}
              >
                {saved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4" />
                    Add to Watchlist
                  </>
                )}
              </Button>
              <Button onClick={handleShare} variant="secondary" className="w-full flex items-center justify-center gap-2 border-border/50">
                <Share2 className="w-4 h-4" />
                Share Film
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Title & Info */}
          <div className="flex flex-col md:pt-16 w-full">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-4">
                {movie.rating && (
                  <span className="font-mono text-xs uppercase tracking-widest text-accent border border-accent/30 px-2 py-0.5 rounded-sm bg-accent/5">
                    ★ {movie.rating}
                  </span>
                )}
                {movie.releaseYear && (
                  <span className="font-mono text-xs uppercase tracking-widest text-secondary">
                    {movie.releaseYear}
                  </span>
                )}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary leading-none tracking-tight mb-6">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-widest text-secondary mb-10 border-b border-border/50 pb-8">
                {movie.duration && <span>{movie.duration}</span>}
                {movie.duration && movie.genres?.length > 0 && <span>·</span>}
                {movie.genres?.join(' · ')}
              </div>

              {/* Mobile Actions */}
              <div className="flex md:hidden flex-col sm:flex-row gap-3 mb-10">
                <Button 
                  onClick={() => toggleMovie(movie)}
                  variant={saved ? "secondary" : "primary"}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  {saved ? (
                    <>
                      <BookmarkCheck className="w-4 h-4" />
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4" />
                      Add to Watchlist
                    </>
                  )}
                </Button>
                <Button onClick={handleShare} variant="secondary" className="sm:flex-none px-4 flex items-center justify-center border-border/50">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="mb-12">
                <p className="font-sans text-primary/80 text-lg md:text-xl leading-relaxed max-w-3xl">
                  {movie.overview || 'No synopsis is currently available for this film.'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section 01: About The Film */}
          <section className="mt-20 md:mt-32">
            <SectionHeading title="01 / About The Film" className="border-t border-border/50 pt-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {movie.director && (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">Directed By</span>
                  <span className="font-sans text-primary">{movie.director}</span>
                </div>
              )}
              {movie.releaseDate && (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">Release Date</span>
                  <span className="font-sans text-primary">{movie.releaseDate}</span>
                </div>
              )}
              {movie.originalLanguage && (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">Language</span>
                  <span className="font-sans text-primary uppercase">{movie.originalLanguage}</span>
                </div>
              )}
              {movie.status && (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">Status</span>
                  <span className="font-sans text-primary">{movie.status}</span>
                </div>
              )}
            </div>
          </section>

          {/* Section 02: Cast */}
          {movie.cast?.length > 0 && (
            <section className="mt-20 md:mt-32">
              <SectionHeading title="02 / Principal Cast" className="border-t border-border/50 pt-8" />
              <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar snap-x snap-mandatory md:grid md:grid-cols-4 lg:grid-cols-5 md:gap-6 gap-4">
                {movie.cast.map(person => (
                  <div key={person.id} className="flex-shrink-0 w-32 md:w-auto snap-start flex flex-col gap-3">
                    <div className="aspect-[2/3] bg-surface-elevated overflow-hidden border border-border/50 rounded-sm">
                      {person.profile ? (
                        <img 
                          src={person.profile} 
                          alt={person.name} 
                          loading="lazy"
                          className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-muted tracking-widest uppercase text-center p-2">
                          No Photo
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-sans font-medium text-primary text-sm leading-tight line-clamp-1" title={person.name}>{person.name}</p>
                      <p className="font-mono text-[10px] text-secondary tracking-wide uppercase mt-1 line-clamp-1" title={person.character}>{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 03: Similar Movies */}
          {movie.similar?.length > 0 && (
            <section className="mt-20 md:mt-32">
              <SectionHeading title="03 / Related Archives" subtitle="Similar films from the collection." className="border-t border-border/50 pt-8" />
              <MovieGrid>
                {movie.similar.map((m, i) => (
                  <MovieCard key={`similar-${m.id}-${i}`} movie={m} />
                ))}
              </MovieGrid>
            </section>
          )}
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default MovieDetails;
