import React from 'react';

export const ProgressBar = ({ percentage = 0, color = '#5E6AD2', height = 'h-2', showLabel = false }) => {
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-mono text-foreground-muted mb-1.5">
          <span>Completion Rate</span>
          <span className="text-white font-semibold">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-white/[0.08] rounded-full overflow-hidden ${height} relative`}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out relative"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 12px ${color}A0`
          }}
        >
          {/* Shimmer line accent inside progress */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};
