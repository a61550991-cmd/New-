import React from 'react';
import { Camera, ShieldCheck, Video, AlertCircle } from 'lucide-react';

interface PermissionDialogProps {
  isOpen: boolean;
  onGrant: () => void;
  onUseSimulation: () => void;
  errorMessage?: string | null;
}

export const PermissionDialog: React.FC<PermissionDialogProps> = ({
  isOpen,
  onGrant,
  onUseSimulation,
  errorMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#12151b] border border-white/15 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl animate-[scaleIn_0.2s_ease-out]">
        {/* Top Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-inner">
          <Camera className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          Izinkan Akses Kamera
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Aplikasi <span className="text-amber-400 font-semibold">Yu Camera</span> membutuhkan izin kamera untuk menampilkan viewfinder real-time, tap-to-focus, dan preview lensa layaknya Google Camera LMC.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-[11px] flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onGrant}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wide transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Berikan Izin Kamera</span>
          </button>

          <button
            onClick={onUseSimulation}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Video className="w-3.5 h-3.5 text-amber-400" />
            <span>Gunakan Simulasi Viewfinder</span>
          </button>
        </div>

        <p className="mt-4 text-[10px] text-slate-400">
          Privasi Anda terjamin. Gambar diproses secara lokal di perangkat Anda.
        </p>
      </div>
    </div>
  );
};
