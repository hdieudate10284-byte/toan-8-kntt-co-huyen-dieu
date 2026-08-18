import React from 'react';

export const Badge = ({
  children,
  variant = 'sky',
  size = 'sm',
  className = ''
}) => {
  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  const variantStyles = {
    sky: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    emerald: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    slate: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${sizeStyles[size] || sizeStyles.sm} ${variantStyles[variant] || variantStyles.sky} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
