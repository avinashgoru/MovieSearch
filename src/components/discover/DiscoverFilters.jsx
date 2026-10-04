import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { useGenres } from '../../hooks/useGenres';
import { cn } from '../../utils/cn';

const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
const RATINGS = [
  { label: 'Any Rating', value: '' },
  { label: '7+ Good', value: '7' },
  { label: '8+ Great', value: '8' },
  { label: '9+ Masterpiece', value: '9' }
];
const SORTS = [
  { label: 'Most Popular', value: 'popularity.desc' },
  { label: 'Highest Rated', value: 'vote_average.desc' },
  { label: 'Newest First', value: 'primary_release_date.desc' },
  { label: 'Oldest First', value: 'primary_release_date.asc' }
];

export const DiscoverFilters = ({ filters, onFilterChange, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { genres } = useGenres();

  const activeFilterCount = ['genre', 'year', 'rating'].filter(k => filters[k]).length + (filters.sort !== 'popularity.desc' ? 1 : 0);

  const handleChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const FilterContent = () => (
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:gap-6 w-full">
      <div className="flex flex-col gap-2 flex-1">
        <label className="font-mono text-xs uppercase tracking-widest text-secondary">Genre</label>
        <select 
          value={filters.genre} 
          onChange={(e) => handleChange('genre', e.target.value)}
          className="bg-surface-elevated border border-border/50 text-primary font-sans text-sm p-3 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 appearance-none rounded-sm cursor-pointer"
        >
          <option value="">Any Genre</option>
          {genres.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <label className="font-mono text-xs uppercase tracking-widest text-secondary">Year</label>
        <select 
          value={filters.year} 
          onChange={(e) => handleChange('year', e.target.value)}
          className="bg-surface-elevated border border-border/50 text-primary font-sans text-sm p-3 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 appearance-none rounded-sm cursor-pointer"
        >
          <option value="">Any Year</option>
          {YEARS.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <label className="font-mono text-xs uppercase tracking-widest text-secondary">Rating</label>
        <select 
          value={filters.rating} 
          onChange={(e) => handleChange('rating', e.target.value)}
          className="bg-surface-elevated border border-border/50 text-primary font-sans text-sm p-3 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 appearance-none rounded-sm cursor-pointer"
        >
          {RATINGS.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <label className="font-mono text-xs uppercase tracking-widest text-secondary">Sort</label>
        <select 
          value={filters.sort} 
          onChange={(e) => handleChange('sort', e.target.value)}
          className="bg-surface-elevated border border-border/50 text-primary font-sans text-sm p-3 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 appearance-none rounded-sm cursor-pointer"
        >
          {SORTS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center pt-2 md:pt-0">
        <button
          onClick={onClear}
          className="font-mono text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors py-3 md:px-4"
        >
          Clear
        </button>
      </div>
    </div>
  );

  return (
    <div className="mb-16">
      {/* Mobile Toggle */}
      <div className="md:hidden mb-6">
        <Button 
          onClick={() => setIsOpen(!isOpen)} 
          variant="secondary"
          className="w-full flex justify-between items-center"
        >
          <span className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Archive
          </span>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-background text-[10px] px-2 py-0.5 rounded-full font-mono">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block bg-surface p-6 border border-border/50 rounded-sm">
        <h3 className="font-mono text-xs uppercase tracking-widest text-secondary mb-6 border-b border-border/50 pb-2">Filter Archive</h3>
        <FilterContent />
      </div>

      {/* Mobile Drawer/Expand */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="bg-surface p-6 border border-border/50 rounded-sm mb-6">
              <FilterContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
