import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const NotFound = () => {
  useDocumentTitle('Not Found');
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 flex flex-col items-center justify-center py-32 px-8 text-center"
    >
      <h1 className="font-display text-7xl md:text-8xl text-primary mb-4 leading-none tracking-tight">404</h1>
      <p className="font-mono text-sm text-accent uppercase tracking-widest mb-6">Record Not Found</p>
      <p className="font-sans text-secondary mb-10 max-w-sm leading-relaxed">
        This page does not exist in the archive.
      </p>
      <Button as={Link} to="/" variant="secondary">
        RETURN HOME
      </Button>
    </motion.div>
  );
};

export default NotFound;
