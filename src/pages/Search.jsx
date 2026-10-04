import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X as XIcon, RotateCcw } from 'lucide-react';
import Container from '../components/ui/Container';
import MovieGrid from '../components/movie/MovieGrid';
import MovieCard from '../components/movie/MovieCard';
import SectionHeading from '../components/sections/SectionHeading';
import Button from '../components/ui/Button';
import { MovieGridSkeleton } from '../components/ui/LoadingSkeletons';
import { useMovieSearch } from '../hooks/useMovieSearch';
import { useDebounce } from '../hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [inputValue, setInputValue] = useState(initialQuery);
  const debouncedQuery = useDebounce(inputValue, 500);
  const inputRef = useRef(null);
  
  const { results, isLoading, error, totalResults } = useMovieSearch(debouncedQuery, 1);

  // Sync URL when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery });
    } else {
      setSearchParams({});
    }
  }, [debouncedQuery, setSearchParams]);

  // Sync input when URL changes (e.g. back button)
  useEffect(() => {
    const queryFromUrl = searchParams.get('q') || '';
    if (queryFromUrl !== debouncedQuery) {
      setInputValue(queryFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('q')]);

  const handleClear = () => {
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleRetry = () => {
    // Forcing a re-render/refetch by momentarily clearing and setting the value,
    // though typically React Query or a reload method in the hook is better.
    // Here we'll just simulate a retry by clearing and resetting.
    const current = inputValue;
    setInputValue('');
    setTimeout(() => setInputValue(current), 10);
  };

  const formattedCount = new Intl.NumberFormat('en-US').format(totalResults || 0);

  return (
    <div className="py-12 md:py-24 flex-1 flex flex-col">
      <Container>
        <div className="max-w-3xl mb-16">
          {!debouncedQuery ? (
            <SectionHeading 
              title="Search Archive" 
              subtitle="Find specific films by title across our database." 
            />
          ) : (
            <div className="mb-10">
              <h1 className="font-display text-4xl md:text-5xl text-primary mb-4 tracking-tight">
                Search Results
              </h1>
              <p className="font-mono text-sm uppercase tracking-widest text-secondary">
                For "{debouncedQuery}"
              </p>
            </div>
          )}
          
          <div className="relative mt-8 group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors w-6 h-6" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a movie title..."
              aria-label="Search movies"
              className="w-full bg-surface-elevated border border-border text-primary font-display text-xl md:text-3xl py-4 md:py-6 pl-14 pr-16 rounded-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 placeholder:text-muted transition-all"
            />
            <AnimatePresence>
              {inputValue && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  onClick={handleClear}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors p-2"
                >
                  <XIcon className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Initial State */}
        {!debouncedQuery && !isLoading && !error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-12 border-t border-border/50"
          >
            <h3 className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">Popular Searches</h3>
            <div className="flex flex-wrap gap-4">
              {['Interstellar', 'The Godfather', 'Dune', 'Oppenheimer', 'Spirited Away'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setInputValue(suggestion)}
                  className="px-4 py-2 bg-surface-elevated border border-border/50 rounded-sm text-sm font-sans text-secondary hover:text-primary hover:border-accent/50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && debouncedQuery && (
          <div className="mt-12">
            <MovieGridSkeleton count={10} />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="py-24 text-center flex flex-col items-center">
            <p className="font-mono text-sm uppercase tracking-widest text-accent mb-4">Transmission Error</p>
            <p className="text-secondary font-sans mb-8 max-w-md">
              We couldn't retrieve the search results at this time.
            </p>
            <Button onClick={handleRetry} variant="secondary" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Empty Results State */}
        {!isLoading && !error && debouncedQuery && results.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="py-24 text-center flex flex-col items-center"
          >
            <p className="font-mono text-sm uppercase tracking-widest text-secondary mb-4">No Record Found</p>
            <p className="text-secondary font-sans mb-8">
              We couldn't find a film matching "{debouncedQuery}".<br />
              Try searching for another title.
            </p>
            <Button onClick={handleClear} variant="secondary">Clear Search</Button>
          </motion.div>
        )}

        {/* Results Grid */}
        {!isLoading && !error && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-end justify-between mb-8 border-b border-border pb-2">
              <p className="font-mono text-xs uppercase tracking-widest text-secondary">
                {formattedCount} {totalResults === 1 ? 'Film' : 'Films'} Found
              </p>
            </div>
            <MovieGrid>
              {results.map((movie, i) => (
                <MovieCard key={`${movie.id}-${i}`} movie={movie} />
              ))}
            </MovieGrid>
          </motion.div>
        )}
      </Container>
    </div>
  );
};

export default Search;
