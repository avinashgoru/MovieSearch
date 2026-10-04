import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Container from '../ui/Container';
import { useWatchlist } from '../../contexts/WatchlistContext';

const Navbar = () => {
  const { watchlist } = useWatchlist();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl font-normal tracking-tight group-hover:text-accent transition-colors">Kino.</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted border-l border-border pl-2 ml-1 hidden sm:block">Archive</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-10">
            <Link to="/discover" className="font-mono text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-2">
              Discover
            </Link>
            <Link to="/watchlist" className="font-mono text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-2">
              Watchlist 
              {watchlist.length > 0 && (
                <span className="bg-surface-elevated text-primary text-[10px] px-1.5 py-0.5 rounded-sm border border-border/50">
                  {String(watchlist.length).padStart(2, '0')}
                </span>
              )}
            </Link>
          </nav>

          <div className="flex items-center">
            <Link to="/search" className="p-2 text-secondary hover:text-primary transition-colors">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
