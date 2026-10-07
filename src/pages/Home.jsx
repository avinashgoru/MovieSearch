import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Container from '../components/ui/Container';
import FeaturedMovie from '../components/sections/FeaturedMovie';
import SectionHeading from '../components/sections/SectionHeading';
import MovieGrid from '../components/movie/MovieGrid';
import MovieCard from '../components/movie/MovieCard';
import Button from '../components/ui/Button';
import { HomeSkeleton, MovieGridSkeleton } from '../components/ui/LoadingSkeletons';
import { useHomeMovies } from '../hooks/useHomeMovies';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { useRecommendations } from '../hooks/useRecommendations';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  useDocumentTitle();
  const { isAuthenticated } = useAuth();
  const { trending, popular, topRated, featured, isLoading, error } = useHomeMovies();
  const { history, isLoading: isHistoryLoading } = useRecentlyViewed();
  const { recommendations, reason, isLoading: isRecLoading } = useRecommendations();

  if (isLoading) {
    return <HomeSkeleton />;
  }

  if (error && !featured && !trending?.length && !popular?.length && !topRated?.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <p className="font-mono text-sm text-accent uppercase tracking-widest mb-4">Transmission Error</p>
        <p className="text-secondary max-w-md mb-8">Some archive records could not be retrieved.</p>
        <Button onClick={() => window.location.reload()} variant="secondary">Try Again</Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 flex flex-col bg-background"
    >
      <div className="mb-24 md:mb-32">
        {featured ? (
          <FeaturedMovie movie={featured} />
        ) : (
          <div className="w-full min-h-[70vh] flex items-center justify-center bg-surface-elevated">
             <p className="font-mono text-sm tracking-widest text-secondary uppercase">Featured Record Unavailable</p>
          </div>
        )}
      </div>

      <Container className="flex flex-col gap-24 md:gap-32 pb-32">
        {!isHistoryLoading && history?.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-end justify-between border-t border-border/50 pt-8 mb-8">
              <SectionHeading 
                number="ARCHIVE HISTORY"
                title="Your Recent Screenings"
                subtitle="Films you've recently explored."
                className="border-none pt-0 mb-0"
              />
              <Button as={Link} to="/recently-viewed" variant="ghost" className="hidden sm:flex text-sm text-secondary hover:text-primary">
                View All History
              </Button>
            </div>
            <MovieGrid>
              {history.slice(0, 10).map((movie, i) => (
                <MovieCard key={`history-${movie.id}-${i}`} movie={movie} />
              ))}
            </MovieGrid>
            <div className="mt-8 flex justify-center sm:hidden">
              <Button as={Link} to="/recently-viewed" variant="secondary" className="w-full">
                View All History
              </Button>
            </div>
          </motion.section>
        )}

        {isAuthenticated && (isRecLoading || recommendations?.length > 0) && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading 
              number="CURATED FOR YOU"
              title="From Your Archive"
              subtitle={reason || "Films selected from your cinema history."}
              className="border-t border-border/50 pt-8"
            />
            {isRecLoading ? (
              <MovieGridSkeleton count={5} />
            ) : (
              <MovieGrid>
                {recommendations.map((movie, i) => (
                  <MovieCard key={`rec-${movie.id}-${i}`} movie={movie} />
                ))}
              </MovieGrid>
            )}
          </motion.section>
        )}

        {trending?.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading 
              number="THIS WEEK / CURRENT SCREENINGS"
              title="Trending Now"
              subtitle="Popular across the archive."
              className="border-t border-border/50 pt-8"
            />
            <MovieGrid>
              {trending.map((movie, i) => (
                <MovieCard key={`trending-${movie.id}-${i}`} movie={movie} />
              ))}
            </MovieGrid>
          </motion.section>
        )}

        {popular?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading 
              number="ALL TIME"
              title="Popular"
              subtitle="The most frequently requested films from the collection."
              className="border-t border-border/50 pt-8"
            />
            <MovieGrid>
              {popular.map((movie, i) => (
                <MovieCard key={`popular-${movie.id}-${i}`} movie={movie} />
              ))}
            </MovieGrid>
          </motion.section>
        )}

        {topRated?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading 
              number="ACCLAIMED"
              title="The Canon"
              subtitle="The highest-rated cinematic achievements."
              className="border-t border-border/50 pt-8"
            />
            <MovieGrid>
              {topRated.map((movie, i) => (
                <MovieCard key={`toprated-${movie.id}-${i}`} movie={movie} />
              ))}
            </MovieGrid>
          </motion.section>
        )}

        {/* Explore Archive CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center pt-16 pb-8 border-t border-border/50"
        >
          <h2 className="font-display text-4xl md:text-5xl text-primary mb-4">The Archive Continues</h2>
          <p className="font-sans text-secondary max-w-md mx-auto mb-8">
            Thousands of films. One place to explore.
          </p>
          <Button as={Link} to="/discover" variant="primary" className="flex items-center gap-3">
            EXPLORE DISCOVER
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.section>
      </Container>
    </motion.div>
  );
};

export default Home;
