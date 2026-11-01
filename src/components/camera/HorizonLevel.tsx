import React, { useEffect, useState } from 'react';

interface HorizonLevelProps {
  visible: boolean;
}

export const HorizonLevel: React.FC<HorizonLevelProps> = ({ visible }) => {
  const [rollAngle, setRollAngle] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null) {
        // Gamma is left-to-right tilt in degrees (-90 to 90)
        setRollAngle(Math.round(e.gamma));
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [visible]);

  if (!visible) return null;

  const isLevel = Math.abs(rollAngle) <= 1;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
      {/* Center crosshair & level horizon lines */}
      <div
        className="relative flex items-center justify-center transition-transform duration-100 ease-out"
        style={{ transform: `rotate(${rollAngle}deg)` }}
      >
        {/* Left wing line */}
        <div
          className={`h-0.5 w-14 transition-colors duration-200 ${
            isLevel ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400/80'
          }`}
        />

        {/* Center gap with indicator dot */}
        <div className="w-12 flex items-center justify-center">
          <div
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
              isLevel ? 'bg-emerald-400 scale-125 shadow-[0_0_8px_rgba(52,211,153,0.9)]' : 'bg-amber-400/80'
            }`}
          />
        </div>

        {/* Right wing line */}
        <div
          className={`h-0.5 w-14 transition-colors duration-200 ${
            isLevel ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400/80'
          }`}
        />

        {/* Degree text */}
        <div
          className={`absolute -bottom-6 px-1.5 py-0.5 rounded text-[10px] font-mono-nums font-semibold transition-colors ${
            isLevel
              ? 'text-emerald-400 bg-black/60 border border-emerald-500/40'
              : 'text-amber-300 bg-black/50'
          }`}
        >
          {isLevel ? '0° LEVEL' : `${rollAngle > 0 ? `+${rollAngle}` : rollAngle}°`}
        </div>
      </div>
    </div>
  );
};
