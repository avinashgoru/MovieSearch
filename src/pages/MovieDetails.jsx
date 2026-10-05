import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { BookmarkPlus, BookmarkCheck, ArrowLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Container from '../components/ui/Container';
import MoviePoster from '../components/movie/MoviePoster';
import MovieGrid from '../components/movie/MovieGrid';
import MovieCard from '../components/movie/MovieCard';
import SectionHeading from '../components/sections/SectionHeading';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { DetailsSkeleton } from '../components/ui/LoadingSkeletons';
import { useMovieDetails } from '../hooks/useMovieDetails';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { cn } from '../utils/cn';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, isLoading, error } = useMovieDetails(id);
  const { isInWatchlist, toggleMovie } = useWatchlist();
  
  useDocumentTitle(movie?.title || '');
  
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
        <p className="font-mono text-sm text-accent uppercase tracking-widest mb-4">Transmission Error</p>
        <p className="text-secondary mb-8">{error || 'We couldn\'t retrieve this film record.'}</p>
        <Button onClick={() => navigate('/discover')} variant="secondary">Return to Archive</Button>
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
      <div className="absolute top-20 left-0 right-0 z-40 bg-gradient-to-b from-background/90 via-background/50 to-transparent pt-6 pb-16 pointer-events-none">
        <Container>
          <button 
            onClick={() => navigate(-1)}
            className="pointer-events-auto inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary/70 hover:text-accent transition-colors mix-blend-difference"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return
          </button>
        </Container>
      </div>

      {/* Cinematic Hero Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[65vh] lg:h-[75vh] bg-surface-elevated overflow-hidden">
        {movie.backdrop ? (
          <motion.img 
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src={movie.backdrop} 
            alt={movie.title} 
            className="w-full h-full object-cover mix-blend-luminosity" 
          />
        ) : (
          <div className="w-full h-full bg-surface-elevated border-b border-border/20" />
        )}
        
        {/* Gradients to blend image into background */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent opacity-90 md:opacity-70" />
      </div>

      <Container className="relative -mt-32 md:-mt-48 lg:-mt-64 z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-24 mb-16 lg:mb-24">
          
          {/* Left Column: Poster & Quick Actions */}
          <div className="w-full max-w-[220px] md:max-w-[280px] lg:w-1/3 lg:max-w-[340px] flex-shrink-0 flex flex-col gap-6 mx-auto lg:mx-0">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <MoviePoster 
                src={movie.poster} 
                alt={movie.title} 
                className="w-full shadow-2xl shadow-black/90 ring-1 ring-border/30" 
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden lg:flex flex-col gap-3"
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
                Share Record
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Title & Info */}
          <div className="flex-1 flex flex-col lg:pt-16">
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
                <div className="flex items-center gap-3 font-mono text-[10px] tracking-widest uppercase text-secondary">
                  <span>Feature Film / {movie.releaseYear || 'XXXX'}</span>
                  {movie.originalLanguage && (
                    <>
                      <span>·</span>
                      <span>{movie.originalLanguage}</span>
                    </>
                  )}
                </div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-accent/80">
                  Archive No. {movie.id.toString().padStart(4, '0')}
                </div>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary leading-[0.95] tracking-tight mb-8">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-10">
                {movie.rating && (
                  <Badge variant="accent">TMDB {movie.rating}</Badge>
                )}
                {movie.duration && (
                  <span className="font-mono text-xs uppercase tracking-widest text-secondary">{movie.duration}</span>
                )}
                {movie.duration && movie.genres?.length > 0 && <span className="text-border">·</span>}
                {movie.genres?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map(g => (
                      <Badge key={g} variant="ghost" className="border-border/50 text-secondary">{g}</Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile/Tablet Actions */}
              <div className="flex lg:hidden flex-col sm:flex-row gap-3 mb-10">
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
                <Button onClick={handleShare} variant="secondary" className="sm:flex-none px-6 flex items-center justify-center border-border/50">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="mb-12 max-w-3xl">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-4 border-l-2 border-accent pl-3">
                  Director's Record
                </h3>
                <p className="font-sans text-primary/85 text-lg leading-relaxed md:text-xl">
                  {movie.overview || 'No archival synopsis available for this film.'}
                </p>
              </div>

              {(movie.director || (movie.writers && movie.writers.length > 0)) && (
                <div className="grid grid-cols-2 gap-8 border-t border-border/40 pt-8 mt-auto max-w-3xl">
                  {movie.director && (
                    <div className="flex flex-col gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">Directed By</span>
                      <span className="font-sans text-primary font-medium">{movie.director}</span>
                    </div>
                  )}
                  {movie.writers && movie.writers.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">Written By</span>
                      <span className="font-sans text-primary font-medium">{movie.writers.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Section 01: Cast */}
          {movie.cast?.length > 0 && (
            <section className="py-16 md:py-24 border-t border-border/30">
              <SectionHeading title="Principal Cast" number="01" subtitle="Leading performers and characters." />
              <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar snap-x snap-mandatory md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-6 gap-4">
                {movie.cast.map(person => (
                  <div key={person.id} className="flex-shrink-0 w-32 md:w-auto snap-start flex flex-col gap-3 group">
                    <div className="aspect-[2/3] bg-surface-elevated overflow-hidden border border-border/50 rounded-sm">
                      {person.profile ? (
                        <img 
                          src={person.profile} 
                          alt={person.name} 
                          loading="lazy"
                          className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-muted tracking-widest uppercase text-center p-2 bg-surface">
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

          {/* Section 02: Similar Movies */}
          {movie.similar?.length > 0 && (
            <section className="py-16 md:py-24 border-t border-border/30">
              <SectionHeading title="Related Archives" number="02" subtitle="Similar films from the collection." />
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
