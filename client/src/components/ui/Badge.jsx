import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // default, accent, success, warning, category
  className = '',
  icon: Icon
}) => {
  const variants = {
    default: 'bg-white/[0.06] text-foreground-muted border-white/10',
    accent: 'bg-[#5E6AD2]/15 text-[#818CF8] border-[#5E6AD2]/30',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    category: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono tracking-wide border ${variants[variant]} ${className}`}>
      {Icon && <Icon className="w-3 h-3" />}
      <span>{children}</span>
    </span>
  );
};
