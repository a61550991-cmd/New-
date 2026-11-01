import React from 'react';
import {
  Zap,
  ZapOff,
  Clock,
  SlidersHorizontal,
  FolderCode,
  FileCode2,
  Video,
} from 'lucide-react';
import { CameraSettings, FlashMode, CameraMode, VideoResolution, VideoFps } from '../../types/camera';

interface TopBarProps {
  settings: CameraSettings;
  mode: CameraMode;
  onUpdateSettings: (newSettings: Partial<CameraSettings>) => void;
  onToggleQuickDrawer: () => void;
  onOpenAndroidModal: () => void;
  onOpenConfigModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  settings,
  mode,
  onUpdateSettings,
  onToggleQuickDrawer,
  onOpenAndroidModal,
  onOpenConfigModal,
}) => {
  const isVideoMode = mode === 'video' || mode === 'slowmo' || mode === 'timelapse';

  const cycleFlash = () => {
    const cycle: FlashMode[] = ['off', 'auto', 'on', 'torch'];
    const nextIdx = (cycle.indexOf(settings.flashMode) + 1) % cycle.length;
    onUpdateSettings({ flashMode: cycle[nextIdx] });
  };

  const cycleTimer = () => {
    const cycle: Array<0 | 3 | 5 | 10> = [0, 3, 5, 10];
    const nextIdx = (cycle.indexOf(settings.timer) + 1) % cycle.length;
    onUpdateSettings({ timer: cycle[nextIdx] });
  };

  const cycleVideoRes = () => {
    const resolutions: VideoResolution[] = ['720p', '1080p', '4k'];
    const nextIdx = (resolutions.indexOf(settings.videoResolution) + 1) % resolutions.length;
    onUpdateSettings({ videoResolution: resolutions[nextIdx] });
  };

  const cycleVideoFps = () => {
    const fpsList: VideoFps[] = [24, 30, 60];
    const nextIdx = (fpsList.indexOf(settings.videoFps) + 1) % fpsList.length;
    onUpdateSettings({ videoFps: fpsList[nextIdx] });
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-4 pt-3 pb-2 bg-gradient-to-b from-black/85 via-black/45 to-transparent">
      {/* Left: Flash or Video Resolution Selector */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={cycleFlash}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/10 active:scale-95 transition-transform"
          title="Mode Flash"
        >
          {settings.flashMode === 'off' && <ZapOff className="w-4 h-4 text-white/70" />}
          {settings.flashMode === 'auto' && (
            <div className="relative">
              <Zap className="w-4 h-4 text-white" />
              <span className="absolute -bottom-1 -right-1 text-[7px] font-bold text-amber-400">A</span>
            </div>
          )}
          {settings.flashMode === 'on' && <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />}
          {settings.flashMode === 'torch' && <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />}
        </button>

        {isVideoMode && (
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-white/10">
            <button
              onClick={cycleVideoRes}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono-nums text-amber-400 hover:bg-white/10"
              title="Resolusi Video (720p, 1080p, 4K)"
            >
              {settings.videoResolution.toUpperCase()}
            </button>
            <span className="text-[10px] text-white/30">/</span>
            <button
              onClick={cycleVideoFps}
              className="px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono-nums text-white/80 hover:bg-white/10"
              title="Frame Rate (24, 30, 60 fps)"
            >
              {settings.videoFps}fps
            </button>
          </div>
        )}
      </div>

      {/* Center: LMC Hasli Signature Status Pill & Quick Sheet trigger */}
      <button
        onClick={onToggleQuickDrawer}
        className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 active:scale-95 transition-all shadow-md group hover:border-amber-400/50"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-xs font-semibold text-slate-200 tracking-wide font-mono-nums">
          LMC 8.4 · {settings.hdrMode === 'plus' ? 'HDR+ Enhanced' : 'HDR Net'}
        </span>
        <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400 ml-0.5 group-hover:rotate-45 transition-transform" />
      </button>

      {/* Right Actions: LMC XML Configs, Source Code & Timer */}
      <div className="flex items-center gap-1.5">
        {/* LMC XML Configs Button */}
        <button
          onClick={onOpenConfigModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 active:scale-95 transition-all text-xs font-bold hover:bg-amber-500/30 shadow-sm"
          title="Buka LMC XML Configs"
        >
          <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline font-mono-nums text-[11px]">XML Config</span>
        </button>

        {/* Android Code Project Inspector */}
        <button
          onClick={onOpenAndroidModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 active:scale-95 transition-all text-xs font-semibold hover:bg-emerald-900/90 shadow-sm"
          title="Buka Source Code Android Kotlin"
        >
          <FolderCode className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline text-[11px]">Android</span>
        </button>

        {/* Timer */}
        <button
          onClick={cycleTimer}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/10 active:scale-95 transition-transform"
          title="Timer"
        >
          <div className="relative flex items-center justify-center">
            <Clock className="w-4 h-4 text-white/80" />
            {settings.timer > 0 && (
              <span className="absolute text-[8px] font-bold text-amber-400 font-mono-nums">
                {settings.timer}
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
