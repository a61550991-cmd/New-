import React, { useRef } from 'react';
import { Camera, RefreshCw, Image as ImageIcon, Square, Circle } from 'lucide-react';
import { CameraMode } from '../../types/camera';

interface BottomBarProps {
  currentMode: CameraMode;
  onSelectMode: (mode: CameraMode) => void;
  zoomRatio: number;
  onSelectZoom: (zoom: number) => void;
  onShutterClick: () => void;
  onFlipCamera: () => void;
  onOpenGallery: () => void;
  onOpenConfigModal: () => void;
  lastCapturedUrl: string | null;
  capturedCount: number;
  isTakingShot: boolean;
  isRecording: boolean;
}

const MODES: { id: CameraMode; label: string }[] = [
  { id: 'night', label: 'Night Sight' },
  { id: 'portrait', label: 'Portrait' },
  { id: 'photo', label: 'Foto' },
  { id: 'video', label: 'Video' },
  { id: 'pro', label: 'Pro/Manual' },
  { id: 'panorama', label: 'Panorama' },
  { id: 'document', label: 'Dokumen' },
  { id: 'slowmo', label: 'Slow-Mo' },
  { id: 'timelapse', label: 'Time-lapse' },
];

const LENS_PRESETS = [
  { zoom: 0.6, label: '.6', desc: 'UW' },
  { zoom: 1.0, label: '1x', desc: 'MAIN' },
  { zoom: 2.0, label: '2x', desc: 'TELE' },
  { zoom: 5.0, label: '5x', desc: 'PERI' },
];

export const BottomBar: React.FC<BottomBarProps> = ({
  currentMode,
  onSelectMode,
  zoomRatio,
  onSelectZoom,
  onShutterClick,
  onFlipCamera,
  onOpenGallery,
  onOpenConfigModal,
  lastCapturedUrl,
  capturedCount,
  isTakingShot,
  isRecording,
}) => {
  const isVideoMode = currentMode === 'video' || currentMode === 'slowmo' || currentMode === 'timelapse';

  // Double click on black padding to trigger LMC XML Config
  const handleDoubleClickPadding = () => {
    onOpenConfigModal();
  };

  return (
    <div
      onDoubleClick={handleDoubleClickPadding}
      className="absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center bg-gradient-to-t from-black via-black/95 to-transparent pt-3 pb-6 px-4"
    >
      {/* 1. LMC Aux Lens Selector Pills (.6x UW, 1x MAIN, 2x TELE, 5x PERI) */}
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 mb-4 shadow-xl">
        {LENS_PRESETS.map((lens) => {
          const isSelected = Math.abs(zoomRatio - lens.zoom) < 0.25;
          return (
            <button
              key={lens.zoom}
              onClick={() => onSelectZoom(lens.zoom)}
              className={`flex flex-col items-center justify-center min-w-[42px] h-[38px] px-2.5 rounded-full transition-all ${
                isSelected
                  ? 'bg-amber-400 text-black shadow-md scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-xs font-bold leading-none font-mono-nums">
                {lens.label}
              </span>
              <span className={`text-[8px] font-semibold tracking-tighter ${isSelected ? 'text-black/80' : 'text-white/50'}`}>
                {lens.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Main Shutter Action Row */}
      <div className="flex items-center justify-between w-full max-w-sm px-4 mb-3">
        {/* Gallery Thumbnail Preview */}
        <button
          onClick={onOpenGallery}
          className="relative w-13 h-13 rounded-full overflow-hidden border-2 border-white/30 bg-zinc-900 flex items-center justify-center active:scale-90 transition-transform shadow-md group"
          title="Buka Galeri Foto & Video"
        >
          {lastCapturedUrl ? (
            <img
              src={lastCapturedUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-5 h-5 text-white/50 group-hover:text-white" />
          )}
          {capturedCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-black font-bold text-[9px] font-mono-nums shadow">
              {capturedCount}
            </span>
          )}
        </button>

        {/* LMC Iconic Dual-Ring Shutter Button */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={onShutterClick}
            disabled={isTakingShot && !isVideoMode}
            className={`w-20 h-20 rounded-full border-4 flex items-center justify-center p-1.5 active:scale-95 transition-all shadow-[0_0_24px_rgba(0,0,0,0.8)] ${
              isVideoMode
                ? isRecording
                  ? 'border-red-500 scale-105'
                  : 'border-white'
                : 'border-white'
            }`}
            title={isVideoMode ? (isRecording ? 'Hentikan Rekam' : 'Mulai Rekam Video') : 'Ambil Foto'}
          >
            {isVideoMode ? (
              // Video Shutter (Red dot or Stop square)
              <div
                className={`transition-all duration-200 flex items-center justify-center ${
                  isRecording
                    ? 'w-8 h-8 rounded-lg bg-red-600 animate-pulse'
                    : 'w-14 h-14 rounded-full bg-red-600'
                }`}
              />
            ) : (
              // Photo Shutter (LMC Amber / Google Circle)
              <div
                className={`w-14 h-14 rounded-full transition-transform duration-150 shadow-inner ${
                  currentMode === 'night'
                    ? 'bg-sky-400'
                    : currentMode === 'portrait'
                    ? 'bg-amber-300'
                    : currentMode === 'pro'
                    ? 'bg-emerald-400'
                    : 'bg-amber-400'
                } ${isTakingShot ? 'scale-75' : ''}`}
              />
            )}
          </button>
        </div>

        {/* Camera Flip Button */}
        <button
          onClick={onFlipCamera}
          className="w-13 h-13 rounded-full border-2 border-white/20 bg-zinc-900/80 backdrop-blur-md flex items-center justify-center text-white/90 active:scale-90 active:rotate-180 transition-all shadow-md hover:bg-zinc-800"
          title="Ganti Kamera Depan / Belakang"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* 3. Horizontal Mode Switcher Carousel */}
      <div className="w-full max-w-md overflow-x-auto no-scrollbar flex items-center justify-center gap-4 py-1">
        {MODES.map((mode) => {
          const isSelected = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`whitespace-nowrap px-2 py-1 text-xs font-semibold tracking-wide transition-colors relative ${
                isSelected
                  ? 'text-amber-400 font-bold scale-105'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {mode.label}
              {isSelected && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
