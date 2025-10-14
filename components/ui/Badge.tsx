import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline' | 'blue' | 'pink' | 'green' | 'purple' | 'indigo' | 'yellow';
  leftIcon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', leftIcon, children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
      secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
      destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      outline: 'border border-gray-200 text-gray-800 dark:border-gray-700 dark:text-gray-100',
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {leftIcon && <span className="mr-1">{leftIcon}</span>}
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };