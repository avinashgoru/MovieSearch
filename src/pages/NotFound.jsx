import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-8 text-center">
      <h1 className="text-6xl font-display mb-4">404</h1>
      <p className="text-secondary mb-8">The page you are looking for does not exist.</p>
      <Link to="/" className="px-6 py-3 bg-surface-elevated text-primary rounded-full border border-border hover:border-secondary transition-colors">
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
