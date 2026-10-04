import { cn } from '../../utils/cn';

const MovieMeta = ({ year, duration, rating, genres = [], className = '' }) => {
  const parts = [
    year,
    genres.length > 0 ? genres[0] : null,
    duration,
    rating ? `${rating} ★` : null
  ].filter(Boolean);

  return (
    <div className={cn('font-mono text-[11px] tracking-wide text-secondary uppercase flex flex-wrap items-center gap-2', className)}>
      {parts.map((part, index) => (
        <div key={index} className="flex items-center gap-2">
          <span>{part}</span>
          {index < parts.length - 1 && <span className="text-muted/50">•</span>}
        </div>
      ))}
    </div>
  );
};

export default MovieMeta;
