import React from 'react';
import { GridType } from '../../types/camera';

interface GridOverlayProps {
  type: GridType;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({ type }) => {
  if (type === 'none') return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {type === '3x3' && (
        <div className="w-full h-full grid grid-cols-3 grid-rows-3">
          <div className="border-r border-b border-white/25" />
          <div className="border-r border-b border-white/25" />
          <div className="border-b border-white/25" />
          <div className="border-r border-b border-white/25" />
          <div className="border-r border-b border-white/25" />
          <div className="border-b border-white/25" />
          <div className="border-r border-white/25" />
          <div className="border-r border-white/25" />
          <div />
        </div>
      )}

      {type === 'golden' && (
        <div className="relative w-full h-full">
          {/* Golden ratio ~0.382 and 0.618 */}
          <div className="absolute top-[38.2%] left-0 right-0 h-px bg-white/30" />
          <div className="absolute top-[61.8%] left-0 right-0 h-px bg-white/30" />
          <div className="absolute left-[38.2%] top-0 bottom-0 w-px bg-white/30" />
          <div className="absolute left-[61.8%] top-0 bottom-0 w-px bg-white/30" />
        </div>
      )}

      {type === 'diagonal' && (
        <svg className="w-full h-full stroke-white/25 stroke-[1]">
          <line x1="0" y1="0" x2="100%" y2="100%" />
          <line x1="100%" y1="0" x2="0" y2="100%" />
        </svg>
      )}
    </div>
  );
};
