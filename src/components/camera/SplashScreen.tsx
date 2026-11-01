import React, { useEffect, useState } from 'react';
import { Camera, Aperture, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onFinish, 600);
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07090c] text-white transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex items-center justify-center mb-6">
        {/* Glowing aura */}
        <div className="absolute w-32 h-32 rounded-full bg-amber-500/20 blur-2xl animate-pulse" />
        
        {/* Outer rotating aperture ring */}
        <div className="relative w-24 h-24 rounded-full border-2 border-amber-400/40 flex items-center justify-center p-2 shadow-2xl shadow-amber-500/10">
          <div className="w-full h-full rounded-full border border-dashed border-amber-300/60 animate-[spin_10s_linear_infinite] flex items-center justify-center">
            <Aperture className="w-10 h-10 text-amber-400" />
          </div>
        </div>

        {/* Center dot */}
        <div className="absolute w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/80" />
      </div>

      <div className="text-center space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
          Yu Camera
        </h1>
        <p className="text-xs tracking-wider uppercase text-amber-400/80 font-medium font-mono-nums">
          LMC Google Camera Engine
        </p>
      </div>

      <div className="mt-8 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        <span>Tahap 1: Preview CameraX & Proyek Android Aktif</span>
      </div>
    </div>
  );
};
