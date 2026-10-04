import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  if (!totalPages || totalPages <= 1) return null;

  // Cap total pages if needed by the API (TMDB caps at 500)
  const maxPages = Math.min(totalPages, 500);

  return (
    <div className={cn("flex flex-col items-center gap-6 mt-24 border-t border-border/50 pt-12", className)}>
      <span className="font-mono text-sm tracking-widest text-secondary uppercase">
        {String(currentPage).padStart(2, '0')} / {String(maxPages).padStart(2, '0')}
      </span>
      
      <div className="flex items-center gap-8 md:gap-16">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:text-accent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= maxPages}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:text-accent transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
