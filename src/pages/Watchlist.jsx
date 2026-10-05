import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../components/ui/Container';
import SectionHeading from '../components/sections/SectionHeading';
import MovieGrid from '../components/movie/MovieGrid';
import MovieCard from '../components/movie/MovieCard';
import Button from '../components/ui/Button';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const Watchlist = () => {
  useDocumentTitle('Watchlist');
  const { watchlist, clear } = useWatchlist();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formattedCount = new Intl.NumberFormat('en-US').format(watchlist.length);

  return (
    <div className="py-12 md:py-24 flex-1 flex flex-col">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <SectionHeading 
            title="My Watchlist" 
            subtitle="Your personal shelf of films." 
            className="mb-0"
          />

          {watchlist.length > 0 && !showClearConfirm && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="font-mono text-xs uppercase tracking-widest text-secondary hover:text-accent transition-colors pb-1 self-start md:self-auto"
            >
              Clear Watchlist
            </button>
          )}

          {showClearConfirm && (
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-surface p-4 border border-border/50 rounded-sm">
              <span className="font-mono text-xs uppercase tracking-widest text-primary">Clear all films?</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="font-mono text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    clear();
                    setShowClearConfirm(false);
                  }}
                  className="font-mono text-xs uppercase tracking-widest text-accent hover:text-primary transition-colors"
                >
                  Confirm Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {watchlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center flex flex-col items-center"
          >
            <p className="font-mono text-sm uppercase tracking-widest text-secondary mb-4">Your Watchlist Is Empty</p>
            <p className="text-secondary font-sans mb-8">
              Films you save will appear here. Start exploring the archive.
            </p>
            <Button as={Link} to="/discover" variant="secondary">Discover Films</Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-end justify-between mb-8 border-b border-border pb-2">
              <p className="font-mono text-xs uppercase tracking-widest text-secondary">
                {formattedCount} {watchlist.length === 1 ? 'Film' : 'Films'}
              </p>
            </div>
            
            <MovieGrid>
              <AnimatePresence>
                {watchlist.map((movie) => (
                  <motion.div
                    key={`watchlist-${movie.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3 }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </MovieGrid>
          </motion.div>
        )}
      </Container>
    </div>
  );
};

export default Watchlist;
