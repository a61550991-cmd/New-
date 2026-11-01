import React from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Compass,
  BarChart3,
  FileCode,
  Sparkles,
  Layers,
  Award,
  Video,
  Eye,
  Camera,
} from 'lucide-react';
import { CameraSettings, GridType, VideoResolution, VideoFps } from '../../types/camera';

interface QuickSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CameraSettings;
  onUpdateSettings: (newSettings: Partial<CameraSettings>) => void;
  onOpenConfigModal: () => void;
}

export const QuickSettingsDrawer: React.FC<QuickSettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenConfigModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-md flex flex-col justify-start animate-[fadeIn_0.15s_ease-out]">
      <div className="bg-[#12151b] border-b border-white/10 p-5 rounded-b-3xl shadow-2xl max-w-lg mx-auto w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Pengaturan LMC 8.4 R18
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-3.5 pt-3 text-xs">
          {/* LMC Config XML Profile shortcut */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-red-500/10 to-transparent border border-amber-400/30 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-amber-400 font-mono-nums">
                Profil XML Aktif
              </p>
              <p className="text-xs font-bold text-white capitalize mt-0.5">
                {settings.lmcProfile.replace(/_/g, ' ')}
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenConfigModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-colors shadow-sm"
            >
              Ganti XML
            </button>
          </div>

          {/* HDR+ Multi-frame mode */}
          <div className="flex items-center justify-between py-1">
            <span className="font-semibold text-slate-200">HDR+ Engine</span>
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
              {(['off', 'auto', 'plus'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => onUpdateSettings({ hdrMode: m })}
                  className={`px-3 py-1 rounded-lg uppercase font-semibold text-[10px] transition-colors ${
                    settings.hdrMode === m
                      ? 'bg-amber-400 text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m === 'plus' ? 'HDR+ Enhanced' : m}
                </button>
              ))}
            </div>
          </div>

          {/* Google AWB (Auto White Balance) */}
          <div className="flex items-center justify-between py-1">
            <span className="font-semibold text-slate-200">Google AWB</span>
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
              {(['off', 'pixel', 'sony'] as const).map((awb) => (
                <button
                  key={awb}
                  onClick={() => onUpdateSettings({ awbMode: awb })}
                  className={`px-2.5 py-1 rounded-lg uppercase font-semibold text-[10px] transition-colors ${
                    settings.awbMode === awb
                      ? 'bg-amber-400 text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {awb === 'pixel' ? 'Pixel 7 AWB' : awb === 'sony' ? 'Sony IMX' : 'OFF'}
                </button>
              ))}
            </div>
          </div>

          {/* Video Resolution & FPS */}
          <div className="flex items-center justify-between py-1">
            <span className="font-semibold text-slate-200">Resolusi Video</span>
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
              {(['720p', '1080p', '4k'] as VideoResolution[]).map((res) => (
                <button
                  key={res}
                  onClick={() => onUpdateSettings({ videoResolution: res })}
                  className={`px-2.5 py-1 rounded-lg uppercase font-bold text-[10px] transition-colors font-mono-nums ${
                    settings.videoResolution === res
                      ? 'bg-amber-400 text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="font-semibold text-slate-200">Frame Rate Video</span>
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
              {([24, 30, 60] as VideoFps[]).map((fps) => (
                <button
                  key={fps}
                  onClick={() => onUpdateSettings({ videoFps: fps })}
                  className={`px-3 py-1 rounded-lg uppercase font-bold text-[10px] transition-colors font-mono-nums ${
                    settings.videoFps === fps
                      ? 'bg-amber-400 text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {fps} fps
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="flex items-center justify-between py-1">
            <span className="font-semibold text-slate-200">Rasio Viewfinder</span>
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
              {(['4:3', '16:9', '1:1', 'full'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => onUpdateSettings({ aspectRatio: r })}
                  className={`px-2.5 py-1 rounded-lg uppercase font-semibold text-[10px] transition-colors ${
                    settings.aspectRatio === r
                      ? 'bg-amber-400 text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Selection */}
          <div className="flex items-center justify-between py-1">
            <span className="font-semibold text-slate-200">Garis Kisi (Grid)</span>
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
              {(['none', '3x3', 'golden', 'diagonal'] as GridType[]).map((g) => (
                <button
                  key={g}
                  onClick={() => onUpdateSettings({ gridType: g })}
                  className={`px-2.5 py-1 rounded-lg uppercase font-semibold text-[10px] transition-colors ${
                    settings.gridType === g
                      ? 'bg-amber-400 text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Toggles Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {/* LMC Watermark */}
            <button
              onClick={() => onUpdateSettings({ watermark: !settings.watermark })}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-colors text-left ${
                settings.watermark
                  ? 'bg-amber-400/15 border-amber-400/50 text-amber-300'
                  : 'bg-black/40 border-white/10 text-slate-400'
              }`}
            >
              <Award className="w-4 h-4 shrink-0 text-amber-400" />
              <div>
                <p className="font-semibold text-[11px] text-white">LMC Watermark</p>
                <p className="text-[10px] text-slate-400">Stamp Leica & lensa</p>
              </div>
            </button>

            {/* RAW (DNG) */}
            <button
              onClick={() => onUpdateSettings({ rawCapture: !settings.rawCapture })}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-colors text-left ${
                settings.rawCapture
                  ? 'bg-amber-400/15 border-amber-400/50 text-amber-300'
                  : 'bg-black/40 border-white/10 text-slate-400'
              }`}
            >
              <FileCode className="w-4 h-4 shrink-0 text-amber-400" />
              <div>
                <p className="font-semibold text-[11px] text-white">RAW + DNG</p>
                <p className="text-[10px] text-slate-400">Sensor raw data</p>
              </div>
            </button>

            {/* Horizon Level */}
            <button
              onClick={() => onUpdateSettings({ horizonLevel: !settings.horizonLevel })}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-colors text-left ${
                settings.horizonLevel
                  ? 'bg-amber-400/15 border-amber-400/50 text-amber-300'
                  : 'bg-black/40 border-white/10 text-slate-400'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0 text-amber-400" />
              <div>
                <p className="font-semibold text-[11px] text-white">Level Horizon</p>
                <p className="text-[10px] text-slate-400">Sensor kemiringan</p>
              </div>
            </button>

            {/* Live Histogram */}
            <button
              onClick={() => onUpdateSettings({ histogram: !settings.histogram })}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-colors text-left ${
                settings.histogram
                  ? 'bg-amber-400/15 border-amber-400/50 text-amber-300'
                  : 'bg-black/40 border-white/10 text-slate-400'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0 text-amber-400" />
              <div>
                <p className="font-semibold text-[11px] text-white">Live Histogram</p>
                <p className="text-[10px] text-slate-400">RGB & Luminance</p>
              </div>
            </button>

            {/* Video Stabilization (EIS) */}
            <button
              onClick={() => onUpdateSettings({ videoStabilization: !settings.videoStabilization })}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-colors text-left ${
                settings.videoStabilization
                  ? 'bg-amber-400/15 border-amber-400/50 text-amber-300'
                  : 'bg-black/40 border-white/10 text-slate-400'
              }`}
            >
              <Video className="w-4 h-4 shrink-0 text-amber-400" />
              <div>
                <p className="font-semibold text-[11px] text-white">Stabilisasi OIS/EIS</p>
                <p className="text-[10px] text-slate-400">Anti guncang video</p>
              </div>
            </button>

            {/* Shutter Sound */}
            <button
              onClick={() => onUpdateSettings({ shutterSound: !settings.shutterSound })}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-colors text-left ${
                settings.shutterSound
                  ? 'bg-amber-400/15 border-amber-400/50 text-amber-300'
                  : 'bg-black/40 border-white/10 text-slate-400'
              }`}
            >
              {settings.shutterSound ? (
                <Volume2 className="w-4 h-4 shrink-0 text-amber-400" />
              ) : (
                <VolumeX className="w-4 h-4 shrink-0" />
              )}
              <div>
                <p className="font-semibold text-[11px] text-white">Suara Shutter</p>
                <p className="text-[10px] text-slate-400">Klik mekanik LMC</p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span>LMC 8.4 Hasli Port Core</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-400 text-black font-semibold hover:bg-amber-300 transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
