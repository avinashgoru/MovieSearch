import { cn } from '../../utils/cn';

const SectionHeading = ({ title, subtitle, number, className = '' }) => {
  return (
    <div className={cn('flex flex-col mb-12', className)}>
      <div className="flex items-center gap-4 mb-4">
        {number && (
          <span className="font-mono text-xs text-secondary tracking-widest uppercase border-b border-accent pb-1">
            {number}
          </span>
        )}
        <h2 className="text-3xl md:text-4xl font-display text-primary uppercase tracking-wide">
          {title}
        </h2>
      </div>
      {subtitle && (
        <div className="pl-0 md:pl-[3.25rem]">
          <p className="text-secondary font-sans text-sm md:text-base max-w-xl">
            {subtitle}
          </p>
        </div>
      )}
      <hr className="border-border mt-8 w-full" />
    </div>
  );
};

export default SectionHeading;
