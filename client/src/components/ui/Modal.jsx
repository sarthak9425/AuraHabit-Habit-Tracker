import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop with Heavy Blur & Translucent Overlay */}
      <div 
        className="fixed inset-0 bg-[#020203]/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog Container */}
      <div className={`relative w-full ${maxWidth} bg-[#0a0a0c] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 z-10 transition-all duration-300 animate-in zoom-in-95 fade-in`}>
        {/* Top Gradient Highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#5E6AD2]/50 to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
          <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-foreground-muted hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};
