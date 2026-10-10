import React from 'react';

export const BackgroundCanvas = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Layer 1 — Base Radial Deep Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0e0e17_0%,#050506_60%,#020203_100%)]" />

      {/* Layer 2 — Noise Pattern */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />

      {/* Layer 3 — Floating Animated Gradient Ambient Light Blobs */}
      {/* Primary Blob (Top Center Indigo Glow) */}
      <div 
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#5E6AD2]/20 blur-[150px] animate-float-slow"
      />

      {/* Secondary Blob (Left Violet Accent) */}
      <div 
        className="absolute top-[30%] -left-[10%] w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[140px] animate-float-medium"
      />

      {/* Tertiary Blob (Right Cyan Accent) */}
      <div 
        className="absolute top-[50%] -right-[10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] animate-float-slow"
      />

      {/* Layer 4 — Technical 64px Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
    </div>
  );
};
