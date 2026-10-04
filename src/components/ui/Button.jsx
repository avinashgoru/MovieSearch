import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Button = forwardRef(({ children, variant = 'primary', className = '', ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-sm font-sans text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary text-background hover:bg-primary/90 px-6 py-3',
    secondary: 'bg-surface-elevated text-primary border border-border hover:border-secondary px-6 py-3',
    ghost: 'bg-transparent text-secondary hover:text-primary px-4 py-2 hover:bg-surface',
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
