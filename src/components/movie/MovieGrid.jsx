import { cn } from '../../utils/cn';

const MovieGrid = ({ children, className = '' }) => {
  return (
    <div className={cn(
      'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12',
      className
    )}>
      {children}
    </div>
  );
};

export default MovieGrid;
