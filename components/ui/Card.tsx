import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  hoverable = false,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-6 border border-slate-100/80 shadow-subtle transition-all duration-300',
        hoverable && 'hover:shadow-premium hover:-translate-y-0.5 hover:border-brand-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
