import React, { useState } from 'react';
import { Sun } from 'lucide-react';

interface FocusRingProps {
  x: number;
  y: number;
  exposure: number;
  onExposureChange: (val: number) => void;
  onClear: () => void;
}

export const FocusRing: React.FC<FocusRingProps> = ({
  x,
  y,
  exposure,
  onExposureChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className="absolute pointer-events-auto z-30 transition-transform select-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Outer pulsing ring */}
      <div className="relative w-16 h-16 rounded-full border-2 border-amber-400 flex items-center justify-center animate-[scaleIn_0.2s_ease-out] shadow-[0_0_12px_rgba(251,191,36,0.5)]">
        {/* Subtle center cross */}
        <div className="w-1 h-1 bg-amber-400 rounded-full" />
      </div>

      {/* Vertical Exposure Compensation Slider (LMC / Google Camera style) */}
      <div
        className="absolute top-1/2 -right-8 -translate-y-1/2 flex flex-col items-center py-2 px-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 touch-none cursor-pointer"
        onPointerDown={(e) => {
          setIsDragging(true);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!isDragging) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const relativeY = (e.clientY - rect.top) / rect.height;
          // Invert: top is brighter (+2), bottom is darker (-2)
          const newExp = Math.max(-2, Math.min(2, (0.5 - relativeY) * 4));
          onExposureChange(Number(newExp.toFixed(1)));
        }}
        onPointerUp={(e) => {
          setIsDragging(false);
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
      >
        <Sun className="w-3.5 h-3.5 text-amber-300 mb-1" />
        <div className="w-1 h-16 bg-white/20 rounded-full relative">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-md"
            style={{
              top: `${((2 - exposure) / 4) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
        <span className="text-[8px] font-mono-nums text-amber-300 mt-1">
          {exposure > 0 ? `+${exposure}` : exposure}
        </span>
      </div>
    </div>
  );
};
