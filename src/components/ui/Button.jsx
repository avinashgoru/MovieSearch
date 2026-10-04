import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Button = forwardRef(({ children, variant = 'primary', className = '', ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-sm font-sans text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';
  
  const variants = {
    primary: 'bg-primary text-background hover:bg-primary/90 px-6 py-3 shadow-sm hover:shadow-md',
    secondary: 'bg-surface-elevated text-primary border border-border hover:border-secondary hover:bg-surface-elevated/80 px-6 py-3',
    ghost: 'bg-transparent text-secondary hover:text-primary px-4 py-2 hover:bg-surface active:bg-surface/80',
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
