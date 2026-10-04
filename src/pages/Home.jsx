import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Container from '../components/ui/Container';
import FeaturedMovie from '../components/sections/FeaturedMovie';
import SectionHeading from '../components/sections/SectionHeading';
import MovieGrid from '../components/movie/MovieGrid';
import MovieCard from '../components/movie/MovieCard';
import Button from '../components/ui/Button';
import { HomeSkeleton } from '../components/ui/LoadingSkeletons';
import { useHomeMovies } from '../hooks/useHomeMovies';

const Home = () => {
  const { trending, popular, topRated, featured, isLoading, error } = useHomeMovies();

  if (isLoading) {
    return <HomeSkeleton />;
  }

  if (error && !featured && !trending.length && !popular.length && !topRated.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <p className="font-mono text-sm text-accent uppercase tracking-widest mb-4">Transmission Error</p>
        <p className="text-secondary max-w-md mb-8">{error}</p>
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
        {featured && <FeaturedMovie movie={featured} />}
      </div>

      <Container className="flex flex-col gap-24 md:gap-32 pb-32">
        {trending?.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading 
              number="01"
              title="Trending Now"
              subtitle="A curated selection of cinema currently capturing the cultural conversation."
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
              number="02"
              title="Popular"
              subtitle="The films defining this era, frequently requested from the archive."
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
              number="03"
              title="Top Rated"
              subtitle="Enduring favorites and the highest-rated cinematic achievements."
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
          <h2 className="font-display text-4xl md:text-5xl text-primary mb-4">Deepen Your Search</h2>
          <p className="font-sans text-secondary max-w-md mx-auto mb-8">
            Access the complete collection. Filter by genre, year, and rating to find exactly what you're looking for.
          </p>
          <Button as={Link} to="/discover" variant="primary" className="flex items-center gap-3">
            EXPLORE THE ARCHIVE
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.section>
      </Container>
    </motion.div>
  );
};

export default Home;
