import { Link } from 'react-router-dom';
import Container from '../ui/Container';

const Footer = () => {
  return (
    <footer className="border-t border-border mt-auto pt-16 pb-8 bg-surface">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
          <div>
            <Link to="/" className="font-display text-3xl mb-4 hover:text-accent transition-colors block">Kino.</Link>
            <p className="font-mono text-[10px] text-muted tracking-widest uppercase">
              CINEMA EDITION <br/>
              EST. {new Date().getFullYear()}
            </p>
          </div>
          
          <nav className="flex flex-wrap gap-8 font-mono text-xs uppercase tracking-widest text-secondary">
            <Link to="/search" className="hover:text-primary focus:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-4 focus:ring-offset-surface rounded-sm">Search</Link>
            <Link to="/discover" className="hover:text-primary focus:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-4 focus:ring-offset-surface rounded-sm">Discover</Link>
            <Link to="/watchlist" className="hover:text-primary focus:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-4 focus:ring-offset-surface rounded-sm">Watchlist</Link>
          </nav>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 gap-4">
          <p className="font-mono text-[10px] text-muted tracking-widest uppercase">
            Built with TMDB
          </p>
          <div className="font-mono text-[10px] text-muted tracking-widest uppercase">
            KINO ARCHIVE
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
