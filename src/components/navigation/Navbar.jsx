import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';
import { useWatchlist } from '../../contexts/WatchlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

const Navbar = () => {
  const { watchlist } = useWatchlist();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Discover', path: '/discover' },
    { name: 'Watchlist', path: '/watchlist', count: watchlist.length }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center justify-between">
            
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm"
              aria-label="Kino Archive Home"
            >
              <span className="font-display text-2xl md:text-3xl font-normal tracking-tight group-hover:text-accent transition-colors">Kino.</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted border-l border-border pl-2 ml-1 hidden sm:block">Archive</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.name}
                  to={link.path} 
                  className={({ isActive }) => cn(
                    "font-mono text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm py-1 relative",
                    isActive ? "text-primary" : "text-secondary hover:text-primary"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {link.count > 0 && (
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-sm border transition-colors",
                          isActive 
                            ? "bg-accent/10 border-accent/30 text-accent" 
                            : "bg-surface-elevated border-border/50 text-primary"
                        )}>
                          {String(link.count).padStart(2, '0')}
                        </span>
                      )}
                      {isActive && (
                        <motion.div 
                          layoutId="navbar-active"
                          className="absolute -bottom-[21px] left-0 right-0 h-[1px] bg-accent"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Actions & Mobile Menu Toggle */}
            <div className="flex items-center gap-2 md:gap-4">
              <NavLink 
                to="/search" 
                className={({ isActive }) => cn(
                  "p-2 transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                  isActive ? "text-accent" : "text-secondary hover:text-primary"
                )}
                aria-label="Search movies"
              >
                <Search className="h-5 w-5" />
              </NavLink>

              <div className="hidden md:flex items-center gap-4 ml-4 border-l border-border/50 pl-4">
                {isAuthenticated ? (
                  <>
                    <span className="font-mono text-xs text-secondary truncate max-w-[100px]" title={user?.name}>{user?.name}</span>
                    <button 
                      onClick={logout}
                      className="font-mono text-xs uppercase tracking-widest text-secondary hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login"
                      className="font-mono text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register"
                      className="font-mono text-xs uppercase tracking-widest bg-primary text-background px-3 py-1.5 hover:bg-white transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                    >
                      Join
                    </Link>
                  </>
                )}
              </div>

              <button 
                className="md:hidden p-2 text-secondary hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden pt-24 px-6 border-b border-border/50 h-[100dvh]"
          >
            <nav className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.name}
                  to={link.path} 
                  className={({ isActive }) => cn(
                    "font-display text-4xl flex items-center justify-between transition-colors",
                    isActive ? "text-accent" : "text-primary"
                  )}
                >
                  {link.name}
                  {link.count > 0 && (
                    <span className="font-mono text-xs border border-border px-3 py-1 rounded-sm text-secondary bg-surface-elevated">
                      {String(link.count).padStart(2, '0')}
                    </span>
                  )}
                </NavLink>
              ))}
              
              <div className="mt-8 pt-8 border-t border-border/50 flex flex-col gap-6">
                {isAuthenticated ? (
                  <>
                    <div className="font-mono text-sm text-secondary">Signed in as <span className="text-primary">{user?.name}</span></div>
                    <button 
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="font-display text-4xl text-left text-secondary hover:text-accent transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink 
                      to="/login" 
                      className={({ isActive }) => cn(
                        "font-display text-4xl transition-colors",
                        isActive ? "text-accent" : "text-secondary hover:text-primary"
                      )}
                    >
                      Sign In
                    </NavLink>
                    <NavLink 
                      to="/register" 
                      className={({ isActive }) => cn(
                        "font-display text-4xl transition-colors",
                        isActive ? "text-accent" : "text-secondary hover:text-primary"
                      )}
                    >
                      Create Account
                    </NavLink>
                  </>
                )}
              </div>
            </nav>
            <div className="mt-auto pb-12 font-mono text-[10px] text-muted tracking-widest uppercase border-t border-border/50 pt-8 mt-16">
              Kino Archive Edition
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
