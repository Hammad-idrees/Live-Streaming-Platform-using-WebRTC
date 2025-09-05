import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 hover:scale-[1.02] active:scale-95',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500 hover:scale-[1.02] active:scale-95',
    live: 'bg-live hover:bg-red-600 text-white focus:ring-live hover:scale-[1.02] active:scale-95 shadow-glow',
    ghost: 'bg-transparent hover:bg-dark-800 text-white border border-dark-700 hover:border-dark-600 focus:ring-primary-500',
    outline: 'bg-transparent hover:bg-primary-600 text-primary-400 hover:text-white border border-primary-600 focus:ring-primary-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 hover:scale-[1.02] active:scale-95',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 hover:scale-[1.02] active:scale-95',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500 hover:scale-[1.02] active:scale-95',
    dark: 'bg-dark-800 hover:bg-dark-700 text-white border border-dark-600 hover:border-dark-500 focus:ring-dark-500',
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Loader2 
          size={iconSizes[size]} 
          className={`animate-spin ${children ? 'mr-2' : ''}`} 
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className={`${children ? 'mr-2' : ''}`}>
          {React.cloneElement(icon, { size: iconSizes[size] })}
        </span>
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className={`${children ? 'ml-2' : ''}`}>
          {React.cloneElement(icon, { size: iconSizes[size] })}
        </span>
      )}
    </button>
  );
};

// Specific button components for common use cases
export const LiveButton = ({ children, ...props }) => (
  <Button variant="live" {...props}>
    {children}
  </Button>
);

export const PrimaryButton = ({ children, ...props }) => (
  <Button variant="primary" {...props}>
    {children}
  </Button>
);

export const SecondaryButton = ({ children, ...props }) => (
  <Button variant="secondary" {...props}>
    {children}
  </Button>
);

export const GhostButton = ({ children, ...props }) => (
  <Button variant="ghost" {...props}>
    {children}
  </Button>
);

export const DangerButton = ({ children, ...props }) => (
  <Button variant="danger" {...props}>
    {children}
  </Button>
);

export default Button;