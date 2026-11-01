import React, { useState } from 'react';
import { ProSettings } from '../../types/camera';
import { Sliders, Sun, Eye, Zap, Crosshair, Sparkles } from 'lucide-react';
import { soundController } from '../../utils/audio';

interface ProControlsBarProps {
  proSettings: ProSettings;
  onUpdateProSettings: (newSettings: Partial<ProSettings>) => void;
  rawEnabled: boolean;
  onToggleRaw: () => void;
}

type ActiveProTab = 'none' | 'iso' | 'shutter' | 'ev' | 'wb' | 'focus' | 'metering';

const ISO_VALUES = ['auto', 50, 100, 200, 400, 800, 1600, 3200];
const SHUTTER_VALUES = [
  'auto',
  '1/8000',
  '1/4000',
  '1/2000',
  '1/1000',
  '1/500',
  '1/250',
  '1/125',
  '1/60',
  '1/30',
  '1/15',
  '1s',
  '2s',
  '4s',
  '8s',
  '16s',
  '32s',
];
const WB_VALUES = ['auto', 2800, 3500, 4500, 5500, 6500, 7500, 8500];

export const ProControlsBar: React.FC<ProControlsBarProps> = ({
  proSettings,
  onUpdateProSettings,
  rawEnabled,
  onToggleRaw,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveProTab>('none');

  const toggleTab = (tab: ActiveProTab) => {
    soundController.playTick();
    setActiveTab((prev) => (prev === tab ? 'none' : tab));
  };

  return (
    <div className="absolute bottom-28 left-0 right-0 z-30 flex flex-col items-center pointer-events-auto px-3">
      {/* 1. Sub-slider Rack for active tab */}
      {activeTab !== 'none' && (
        <div className="mb-2 w-full max-w-md bg-black/85 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 shadow-2xl flex items-center justify-center animate-[scaleIn_0.15s_ease-out]">
          {/* ISO Picker */}
          {activeTab === 'iso' && (
            <div className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] text-amber-400 font-bold px-1.5 shrink-0 uppercase font-mono-nums">
                ISO
              </span>
              {ISO_VALUES.map((val) => {
                const isSelected = proSettings.iso === val;
                return (
                  <button
                    key={String(val)}
                    onClick={() => onUpdateProSettings({ iso: val as number | 'auto' })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono-nums font-semibold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-black shadow-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {val === 'auto' ? 'AUTO' : val}
                  </button>
                );
              })}
            </div>
          )}

          {/* Shutter Speed Picker */}
          {activeTab === 'shutter' && (
            <div className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] text-amber-400 font-bold px-1.5 shrink-0 uppercase font-mono-nums">
                SEC
              </span>
              {SHUTTER_VALUES.map((val) => {
                const isSelected = proSettings.shutterSpeed === val;
                return (
                  <button
                    key={val}
                    onClick={() => onUpdateProSettings({ shutterSpeed: val })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono-nums font-semibold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-black shadow-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {val === 'auto' ? 'AUTO' : `${val}s`}
                  </button>
                );
              })}
            </div>
          )}

          {/* White Balance Picker */}
          {activeTab === 'wb' && (
            <div className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] text-amber-400 font-bold px-1.5 shrink-0 uppercase font-mono-nums">
                KELVIN
              </span>
              {WB_VALUES.map((val) => {
                const isSelected = proSettings.whiteBalance === val;
                return (
                  <button
                    key={String(val)}
                    onClick={() => onUpdateProSettings({ whiteBalance: val as number | 'auto' })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono-nums font-semibold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-black shadow-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {val === 'auto' ? 'AUTO' : `${val}K`}
                  </button>
                );
              })}
            </div>
          )}

          {/* Focus & Peaking */}
          {activeTab === 'focus' && (
            <div className="w-full flex items-center justify-between gap-3 px-2">
              <button
                onClick={() => onUpdateProSettings({ focusDistance: 'auto' })}
                className={`px-3 py-1 rounded-lg text-xs font-mono-nums font-semibold ${
                  proSettings.focusDistance === 'auto'
                    ? 'bg-amber-400 text-black'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                AF (Auto)
              </button>

              <div className="flex-1 flex items-center gap-2">
                <span className="text-[10px] text-slate-400">Macro</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={proSettings.focusDistance === 'auto' ? 0.5 : proSettings.focusDistance}
                  onChange={(e) =>
                    onUpdateProSettings({ focusDistance: parseFloat(e.target.value) })
                  }
                  className="flex-1 accent-amber-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Inf</span>
              </div>

              <button
                onClick={() =>
                  onUpdateProSettings({ focusPeaking: !proSettings.focusPeaking })
                }
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold border ${
                  proSettings.focusPeaking
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'text-slate-400 border-white/10'
                }`}
              >
                Peaking
              </button>
            </div>
          )}

          {/* Metering Mode */}
          {activeTab === 'metering' && (
            <div className="w-full flex items-center justify-center gap-3">
              {(['matrix', 'center', 'spot'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onUpdateProSettings({ meteringMode: mode })}
                  className={`px-3.5 py-1 rounded-lg text-xs font-semibold uppercase ${
                    proSettings.meteringMode === mode
                      ? 'bg-amber-400 text-black'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Main Pro Pills Toolbar */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 shadow-xl">
        {/* ISO Pill */}
        <button
          onClick={() => toggleTab('iso')}
          className={`px-3 py-1.5 rounded-xl flex flex-col items-center min-w-[50px] transition-colors ${
            activeTab === 'iso' ? 'bg-amber-400 text-black' : 'text-slate-200 hover:bg-white/10'
          }`}
        >
          <span className="text-[8px] font-bold uppercase tracking-wider opacity-70">ISO</span>
          <span className="text-[11px] font-bold font-mono-nums">
            {proSettings.iso === 'auto' ? 'A' : proSettings.iso}
          </span>
        </button>

        {/* Shutter Pill */}
        <button
          onClick={() => toggleTab('shutter')}
          className={`px-3 py-1.5 rounded-xl flex flex-col items-center min-w-[50px] transition-colors ${
            activeTab === 'shutter' ? 'bg-amber-400 text-black' : 'text-slate-200 hover:bg-white/10'
          }`}
        >
          <span className="text-[8px] font-bold uppercase tracking-wider opacity-70">SHUTTER</span>
          <span className="text-[11px] font-bold font-mono-nums">
            {proSettings.shutterSpeed === 'auto' ? 'A' : proSettings.shutterSpeed}
          </span>
        </button>

        {/* WB Pill */}
        <button
          onClick={() => toggleTab('wb')}
          className={`px-3 py-1.5 rounded-xl flex flex-col items-center min-w-[50px] transition-colors ${
            activeTab === 'wb' ? 'bg-amber-400 text-black' : 'text-slate-200 hover:bg-white/10'
          }`}
        >
          <span className="text-[8px] font-bold uppercase tracking-wider opacity-70">WB</span>
          <span className="text-[11px] font-bold font-mono-nums">
            {proSettings.whiteBalance === 'auto' ? 'A' : `${proSettings.whiteBalance}K`}
          </span>
        </button>

        {/* Focus Pill */}
        <button
          onClick={() => toggleTab('focus')}
          className={`px-3 py-1.5 rounded-xl flex flex-col items-center min-w-[50px] transition-colors ${
            activeTab === 'focus' ? 'bg-amber-400 text-black' : 'text-slate-200 hover:bg-white/10'
          }`}
        >
          <span className="text-[8px] font-bold uppercase tracking-wider opacity-70">FOCUS</span>
          <span className="text-[11px] font-bold font-mono-nums">
            {proSettings.focusDistance === 'auto' ? 'AF' : 'MF'}
          </span>
        </button>

        {/* Metering Pill */}
        <button
          onClick={() => toggleTab('metering')}
          className={`px-2.5 py-1.5 rounded-xl flex flex-col items-center transition-colors ${
            activeTab === 'metering' ? 'bg-amber-400 text-black' : 'text-slate-200 hover:bg-white/10'
          }`}
        >
          <span className="text-[8px] font-bold uppercase tracking-wider opacity-70">METER</span>
          <span className="text-[10px] font-bold font-mono-nums uppercase">
            {proSettings.meteringMode.slice(0, 3)}
          </span>
        </button>

        {/* RAW Toggle */}
        <button
          onClick={onToggleRaw}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono-nums transition-colors ${
            rawEnabled
              ? 'bg-amber-400 text-black shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle RAW (DNG) Capture"
        >
          RAW
        </button>
      </div>
    </div>
  );
};
