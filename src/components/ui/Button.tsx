import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'base' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'base',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-base font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

    const variants = {
      primary:
        'bg-sage-500 text-white hover:bg-sage-600 active:bg-sage-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-xs disabled:hover:translate-y-0 disabled:hover:shadow-sm',
      secondary:
        'bg-white text-espresso-500 border-[1.5px] border-neutral-300 hover:bg-[#FDFCFA] hover:border-teal-500',
      ghost:
        'bg-transparent text-teal-500 hover:bg-teal-50',
      destructive:
        'bg-[#8B3A3A] text-white hover:bg-[#6B2C2C] shadow-sm hover:shadow-md',
    };

    const sizes = {
      sm: 'px-5 py-2.5 text-sm',
      base: 'px-6 py-3 text-body-base',
      lg: 'px-7 py-3.5 text-body-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
