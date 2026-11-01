import React from 'react';
import { CheckCircle2, ChevronRight, Layers, Sparkles } from 'lucide-react';

interface StepProgressBannerProps {
  onOpenCodeModal: () => void;
}

export const StepProgressBanner: React.FC<StepProgressBannerProps> = ({
  onOpenCodeModal,
}) => {
  return (
    <div className="bg-[#111419] border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px] shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Tahap 1 Selesai</span>
        </div>
        <span className="hidden sm:inline text-slate-300 truncate">
          Setup Proyek Android (Gradle, Manifest, Hilt, CameraX) & Preview Kamera Real-time Aktif
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenCodeModal}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 hover:text-amber-200 transition-colors text-[11px] font-medium"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Lihat File Android</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
