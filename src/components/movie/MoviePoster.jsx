import { useState } from 'react';
import { Film } from 'lucide-react';
import { cn } from '../../utils/cn';

const MoviePoster = ({ src, alt, className = '', aspectRatio = 'portrait' }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectStyles = {
    portrait: 'aspect-[2/3]',
    landscape: 'aspect-[16/9]',
  };

  return (
    <div className={cn('relative overflow-hidden bg-surface-elevated', aspectStyles[aspectRatio], className)}>
      {(!src || hasError) ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center border border-border/50">
          <Film className="w-8 h-8 text-muted mb-2 opacity-50" />
          <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
            Image Unavailable
          </span>
        </div>
      ) : (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-surface-elevated animate-pulse" />
          )}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={cn(
              'object-cover w-full h-full transition-all duration-700 ease-out',
              isLoaded ? 'opacity-100' : 'opacity-0 scale-105'
            )}
          />
        </>
      )}
    </div>
  );
};

export default MoviePoster;
