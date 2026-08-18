import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'sky'
}) => {
  const colorMap = {
    sky: 'from-sky-500/20 to-blue-600/10 text-sky-400 border-sky-500/30',
    teal: 'from-teal-500/20 to-emerald-600/10 text-teal-400 border-teal-500/30',
    amber: 'from-amber-500/20 to-yellow-600/10 text-amber-300 border-amber-500/30',
    rose: 'from-rose-500/20 to-red-600/10 text-rose-400 border-rose-500/30'
  };

  return (
    <div className="glass-card p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              {trend && <span className="text-teal-400 font-medium">{trend}</span>}
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3.5 rounded-xl bg-gradient-to-br border ${colorMap[color] || colorMap.sky} shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {/* Decorative gradient glow on bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default StatCard;
