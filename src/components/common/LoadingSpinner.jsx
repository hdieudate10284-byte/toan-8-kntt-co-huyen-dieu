import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Đang tải dữ liệu...', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 text-slate-400">
      <div className="relative">
        <Loader2 className={`${sizeMap[size] || sizeMap.md} animate-spin text-sky-400`} />
        <div className="absolute inset-0 blur-lg bg-sky-500/20 -z-10 animate-pulse" />
      </div>
      {text && <p className="text-sm font-medium animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
