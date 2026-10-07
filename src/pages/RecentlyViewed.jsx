import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { History, ArrowRight, Trash2 } from 'lucide-react';
import Container from '../components/ui/Container';
import MovieGrid from '../components/movie/MovieGrid';
import MovieCard from '../components/movie/MovieCard';
import Button from '../components/ui/Button';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { MovieGridSkeleton } from '../components/ui/LoadingSkeletons';

const RecentlyViewed = () => {
  useDocumentTitle('Recent Screenings');
  const { history, isLoading, error, clearHistory } = useRecentlyViewed();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearHistory = async () => {
    setIsClearing(true);
    await clearHistory();
    setIsClearing(false);
    setShowConfirmClear(false);
  };

  if (isLoading) {
    return (
      <Container className="pt-24 pb-32">
        <div className="mb-12">
          <div className="h-10 w-64 bg-surface-elevated animate-pulse mb-4" />
          <div className="h-6 w-96 bg-surface-elevated animate-pulse" />
        </div>
        <MovieGridSkeleton count={10} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="pt-32 pb-32 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <p className="font-mono text-sm text-accent uppercase tracking-widest mb-4">Transmission Error</p>
        <p className="text-secondary max-w-md mb-8">We couldn't retrieve your recent screenings.</p>
        <Button onClick={() => window.location.reload()} variant="secondary">Retry</Button>
      </Container>
    );
  }

  if (!history?.length) {
    return (
      <Container className="pt-32 pb-32 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mb-6">
          <History className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="font-display text-4xl text-primary mb-4">NO SCREENINGS YET</h1>
        <p className="font-sans text-secondary max-w-md mx-auto mb-8">
          Movies you explore will appear here.
        </p>
        <Button as={Link} to="/discover" variant="primary" className="flex items-center gap-3">
          EXPLORE MOVIES
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="bg-background min-h-screen"
    >
      <Container className="pt-24 md:pt-32 pb-32">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-8">
          <div>
            <p className="font-mono text-sm text-secondary uppercase tracking-widest mb-4">
              ARCHIVAL RECORD • {history.length} {history.length === 1 ? 'FILM' : 'FILMS'}
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-primary">
              RECENT SCREENINGS
            </h1>
            <p className="font-sans text-secondary mt-4 max-w-2xl">
              A record of the films you've recently explored.
            </p>
          </div>

          <div className="flex items-center relative">
            <AnimatePresence mode="wait">
              {showConfirmClear ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 bg-surface-elevated px-4 py-2"
                >
                  <span className="text-sm text-secondary">Clear your recent screenings?</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowConfirmClear(false)}
                      className="px-3 py-1.5 text-xs h-auto"
                      disabled={isClearing}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleClearHistory}
                      className="px-3 py-1.5 text-xs h-auto bg-accent hover:bg-accent/90"
                      disabled={isClearing}
                    >
                      {isClearing ? 'Clearing...' : 'Clear History'}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowConfirmClear(true)}
                    className="flex items-center gap-2 text-secondary hover:text-accent group"
                  >
                    <Trash2 className="w-4 h-4 transition-colors group-hover:text-accent" />
                    Clear History
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <MovieGrid>
          {history.map((movie, i) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.5) }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </MovieGrid>
      </Container>
    </motion.div>
  );
};

export default RecentlyViewed;
