import { cn } from '../../utils/cn';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-surface-elevated text-secondary border border-border',
    accent: 'bg-accent-soft text-accent border border-accent/20',
    ghost: 'bg-transparent text-secondary border border-border',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono tracking-widest uppercase transition-colors',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
