import React from 'react';
import { CAMERA_FILTERS, CameraFilterId } from '../../utils/lmcFilters';
import { Sparkles, X, Check } from 'lucide-react';
import { soundController } from '../../utils/audio';

interface FilterSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilterId: CameraFilterId;
  onSelectFilter: (id: CameraFilterId) => void;
}

export const FilterSelector: React.FC<FilterSelectorProps> = ({
  isOpen,
  onClose,
  activeFilterId,
  onSelectFilter,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-28 left-0 right-0 z-35 flex flex-col items-center pointer-events-auto px-3 animate-[slideUp_0.15s_ease-out]">
      <div className="w-full max-w-lg bg-[#0e1117]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-3 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 px-2 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white tracking-wide">
              Filter & LUT Real-Time LMC
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal filter scroller */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-3 px-1">
          {CAMERA_FILTERS.map((f) => {
            const isSelected = activeFilterId === f.id;
            return (
              <button
                key={f.id}
                onClick={() => {
                  soundController.playTick();
                  onSelectFilter(f.id);
                }}
                className={`flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none transition-all ${
                  isSelected ? 'scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {/* Visual Preview Circle with CSS Filter applied */}
                <div
                  className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all shadow-md ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/30'
                      : 'border-white/20 group-hover:border-white/40'
                  }`}
                >
                  {/* Miniature simulated preview gradient with the filter applied */}
                  <div
                    className="w-full h-full bg-gradient-to-tr from-sky-600 via-amber-500 to-rose-500 transition-all"
                    style={{
                      filter: f.cssFilter === 'none' ? 'none' : f.cssFilter,
                    }}
                  />

                  {/* Category color dot */}
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full border border-black/50"
                    style={{ backgroundColor: f.colorTone }}
                  />

                  {isSelected && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-amber-400 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Filter Name */}
                <span
                  className={`text-[10px] font-semibold max-w-[68px] text-center truncate ${
                    isSelected ? 'text-amber-400 font-bold' : 'text-slate-300'
                  }`}
                >
                  {f.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Filter Description */}
        {(() => {
          const current = CAMERA_FILTERS.find((item) => item.id === activeFilterId);
          if (!current) return null;
          return (
            <div className="pt-2 px-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
              <span className="truncate">{current.desc}</span>
              <span className="text-[10px] uppercase font-mono-nums font-bold text-amber-400 shrink-0 ml-2">
                {current.category}
              </span>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
