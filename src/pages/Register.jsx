import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Container from '../components/ui/Container';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to register. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="flex-1 flex flex-col justify-center items-center py-16">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl md:text-6xl mb-4 tracking-tight">Create Account</h1>
          <p className="text-secondary font-mono text-sm tracking-widest uppercase">
            Join the cinema archive
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-500/20 bg-red-500/5 text-red-400 rounded-sm text-center" role="alert">
            {error === 'Database service is temporarily unavailable.' ? (
              <>
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">Transmission Error</p>
                <p className="text-sm">We couldn't connect to the account service. Please try again.</p>
              </>
            ) : (
              <p className="text-sm text-left">{error}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-xs font-mono uppercase tracking-widest text-secondary">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="w-full bg-surface border border-border rounded-sm px-4 py-3 text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-mono uppercase tracking-widest text-secondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-surface border border-border rounded-sm px-4 py-3 text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs font-mono uppercase tracking-widest text-secondary">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full bg-surface border border-border rounded-sm px-4 py-3 text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-xs font-mono uppercase tracking-widest text-secondary">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full bg-surface border border-border rounded-sm px-4 py-3 text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-background font-mono text-xs uppercase tracking-widest py-4 rounded-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-border/50 pt-8">
          <p className="text-sm text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </Container>
  );
};

export default Register;
