import React from 'react';
import { X, Download, Trash2, Info, Video, Camera, Play } from 'lucide-react';
import { CapturedItem } from '../../types/camera';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CapturedItem[];
  onDeleteItem: (id: string) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  items,
  onDeleteItem,
}) => {
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [showExif, setShowExif] = React.useState(false);

  if (!isOpen) return null;

  const currentItem = items[selectedIdx] || null;

  const formatSec = (sec?: number) => {
    if (!sec) return '00:00';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md">
      <div className="bg-[#101217] border border-white/15 rounded-3xl w-full max-w-4xl h-[88vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#15181f]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">
              Galeri LMC Yu Camera
            </span>
            <span className="text-xs text-slate-400 font-mono-nums">
              ({items.length} media)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentItem && (
              <>
                <button
                  onClick={() => setShowExif(!showExif)}
                  className={`p-2 rounded-xl transition-colors ${
                    showExif ? 'bg-amber-400 text-black' : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                  title="Lihat Metadata EXIF & Video"
                >
                  <Info className="w-4 h-4" />
                </button>
                <a
                  href={currentItem.url}
                  download={
                    currentItem.type === 'video'
                      ? `YuCamera_Video_${currentItem.id}.webm`
                      : `YuCamera_Photo_${currentItem.id}.jpg`
                  }
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                  title="Download Media"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => onDeleteItem(currentItem.id)}
                  className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3 text-slate-500">
              <Camera className="w-8 h-8" />
            </div>
            <p className="text-base font-semibold text-white">Belum ada foto atau video</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Gunakan tombol shutter untuk mengambil foto beresolusi tinggi atau beralih ke mode Video untuk merekam video langsung.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Main Picture / Video Player Display */}
            <div className="flex-1 relative flex items-center justify-center bg-black p-4 overflow-hidden">
              {currentItem.type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center">
                  <video
                    src={currentItem.url}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-full max-w-full rounded-2xl shadow-2xl object-contain bg-black"
                  />
                </div>
              ) : (
                <img
                  src={currentItem.url}
                  alt="Captured"
                  className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
                />
              )}

              {/* Metadata Card Overlay */}
              {showExif && (
                <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-84 p-4 rounded-2xl bg-black/85 backdrop-blur-md border border-white/20 text-xs text-white space-y-2.5 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/15 pb-2">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      {currentItem.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                      <span>{currentItem.type === 'video' ? 'Video Recording Specs' : 'LMC Photo EXIF'}</span>
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono-nums">{currentItem.resolution}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono-nums">
                    <div>
                      <span className="text-slate-400">Mode: </span>
                      <span className="font-semibold text-white capitalize">{currentItem.mode}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Rasio: </span>
                      <span className="font-semibold text-white">{currentItem.aspectRatio}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Zoom: </span>
                      <span className="font-semibold text-white">{currentItem.zoom}x</span>
                    </div>
                    <div>
                      <span className="text-slate-400">XML: </span>
                      <span className="font-semibold text-amber-300 capitalize">{currentItem.lmcConfig?.replace(/_/g, ' ') || 'Vibrant'}</span>
                    </div>
                    {currentItem.type === 'video' ? (
                      <>
                        <div>
                          <span className="text-slate-400">Durasi: </span>
                          <span className="font-semibold text-red-400">{formatSec(currentItem.duration)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Codec: </span>
                          <span className="font-semibold text-white">VP9/VP8 · Opus</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-slate-400">ISO: </span>
                          <span className="font-semibold text-white">{currentItem.metadata?.iso || 100}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Shutter: </span>
                          <span className="font-semibold text-white">{currentItem.metadata?.shutter || '1/250s'}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 pt-1 border-t border-white/10 font-mono-nums">
                    {currentItem.timestamp.toLocaleTimeString()} · {currentItem.timestamp.toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Thumbnail Carousel Bar */}
            <div className="h-20 md:h-auto md:w-32 bg-[#13161c] border-t md:border-t-0 md:border-l border-white/10 flex md:flex-col items-center gap-2 p-2 overflow-auto no-scrollbar">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`relative w-16 h-16 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    idx === selectedIdx
                      ? 'border-amber-400 scale-95 shadow-md ring-2 ring-amber-400/30'
                      : 'border-white/15 opacity-60 hover:opacity-100'
                  }`}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center relative">
                      <Play className="w-5 h-5 text-white/90 fill-white/80" />
                      <span className="absolute bottom-1 right-1 text-[8px] font-mono-nums font-bold bg-black/80 px-1 rounded text-red-400">
                        {formatSec(item.duration)}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt="Thumb"
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
