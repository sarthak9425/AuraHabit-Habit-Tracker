import React, { useRef, useState } from 'react';

export const SpotlightCard = ({ 
  children, 
  className = '', 
  spotlightColor = 'rgba(94, 106, 210, 0.15)',
  onClick,
  style = {} 
}) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={style}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0c]/80 backdrop-blur-xl p-6 shadow-linear-card transition-all duration-300 hover:border-white/[0.12] hover:shadow-linear-hover ${className}`}
    >
      {/* Top Edge Hairline Highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Radial Spotlight Glow following mouse */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};
