import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import Container from '../components/ui/Container';
import SectionHeading from '../components/sections/SectionHeading';
import MovieGrid from '../components/movie/MovieGrid';
import MovieCard from '../components/movie/MovieCard';
import Button from '../components/ui/Button';
import { MovieGridSkeleton } from '../components/ui/LoadingSkeletons';
import { DiscoverFilters } from '../components/discover/DiscoverFilters';
import { Pagination } from '../components/ui/Pagination';
import { useDiscoverMovies } from '../hooks/useDiscoverMovies';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const Discover = () => {
  useDocumentTitle('Discover');
  const [searchParams, setSearchParams] = useSearchParams();

  // Map URL params to filters object
  const filters = useMemo(() => ({
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || 'popularity.desc',
    page: parseInt(searchParams.get('page')) || 1,
  }), [searchParams]);

  const { results, isLoading, error, totalPages, totalResults } = useDiscoverMovies(filters);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    
    // Apply changes
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset page to 1 whenever any filter changes (except page itself)
    if (newFilters.page === undefined) {
      params.delete('page');
    }

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams({}); // clears everything, dropping back to defaults
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const formattedCount = new Intl.NumberFormat('en-US').format(totalResults || 0);

  return (
    <div className="py-12 md:py-24 flex-1 flex flex-col">
      <Container>
        <SectionHeading 
          title="Discover Archive" 
          subtitle="Explore the catalog using curated filters and sorting options." 
        />

        <DiscoverFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onClear={handleClearFilters} 
        />

        {/* Loading State */}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            <MovieGridSkeleton count={20} />
          </motion.div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="py-24 text-center flex flex-col items-center">
            <p className="font-mono text-sm uppercase tracking-widest text-accent mb-4">Transmission Error</p>
            <p className="text-secondary font-sans mb-8 max-w-md">
              The archive could not be retrieved at this time.
            </p>
            <Button onClick={handleRetry} variant="secondary" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && results.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="py-24 text-center flex flex-col items-center"
          >
            <p className="font-mono text-sm uppercase tracking-widest text-secondary mb-4">No Films Found</p>
            <p className="text-secondary font-sans mb-8">
              No films match the current archive filters.
            </p>
            <Button onClick={handleClearFilters} variant="secondary">Clear Filters</Button>
          </motion.div>
        )}

        {/* Results */}
        {!isLoading && !error && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-end justify-between mb-8 border-b border-border pb-2">
              <p className="font-mono text-xs uppercase tracking-widest text-secondary">
                {formattedCount} Films Found
              </p>
            </div>
            
            <MovieGrid>
              {results.map((movie, i) => (
                <MovieCard key={`discover-${movie.id}-${i}`} movie={movie} />
              ))}
            </MovieGrid>

            <Pagination 
              currentPage={filters.page} 
              totalPages={totalPages} 
              onPageChange={(page) => {
                handleFilterChange({ page });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
          </motion.div>
        )}
      </Container>
    </div>
  );
};

export default Discover;
