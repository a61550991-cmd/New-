import React, { useEffect, useRef } from 'react';

interface HistogramOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  visible: boolean;
}

export const HistogramOverlay: React.FC<HistogramOverlayProps> = ({ videoRef, visible }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!visible) return;

    let timerId: number;

    const sampleCanvas = hiddenCanvasRef.current || document.createElement('canvas');
    sampleCanvas.width = 32;
    sampleCanvas.height = 24;
    hiddenCanvasRef.current = sampleCanvas;
    const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });

    // Update at relaxed ~3.5 fps to ensure 100% smooth UI and 0% CPU lag
    const updateHistogram = () => {
      const video = videoRef.current;
      const targetCanvas = canvasRef.current;

      if (video && targetCanvas && sampleCtx && video.readyState >= 2) {
        const targetCtx = targetCanvas.getContext('2d');
        if (targetCtx) {
          try {
            sampleCtx.drawImage(video, 0, 0, 32, 24);
            const imgData = sampleCtx.getImageData(0, 0, 32, 24).data;

            const bins = new Uint32Array(24);
            for (let i = 0; i < imgData.length; i += 4) {
              const luma = Math.floor((0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2]) / 10.7);
              const safeBin = Math.min(23, Math.max(0, luma));
              bins[safeBin]++;
            }

            let maxCount = 1;
            for (let i = 0; i < 24; i++) {
              if (bins[i] > maxCount) maxCount = bins[i];
            }

            const w = targetCanvas.width;
            const h = targetCanvas.height;
            targetCtx.clearRect(0, 0, w, h);

            targetCtx.fillStyle = 'rgba(0, 0, 0, 0.55)';
            targetCtx.fillRect(0, 0, w, h);

            const barWidth = w / 24;
            targetCtx.fillStyle = 'rgba(255, 213, 79, 0.85)'; // Amber LMC tone

            for (let i = 0; i < 24; i++) {
              const barHeight = Math.max(2, (bins[i] / maxCount) * (h - 4));
              targetCtx.fillRect(i * barWidth, h - barHeight, barWidth - 0.6, barHeight);
            }
          } catch {
            // cross-origin or video not ready
          }
        }
      }
    };

    timerId = window.setInterval(updateHistogram, 300);

    return () => {
      clearInterval(timerId);
    };
  }, [videoRef, visible]);

  if (!visible) return null;

  return (
    <div className="absolute top-20 right-4 z-20 pointer-events-none flex flex-col items-end">
      <div className="rounded-lg overflow-hidden border border-white/20 shadow-lg backdrop-blur-md">
        <canvas
          ref={canvasRef}
          width={84}
          height={40}
          className="block w-21 h-10"
        />
      </div>
      <span className="text-[8px] font-mono-nums text-white/60 tracking-wider mt-0.5 uppercase">
        Live Histogram
      </span>
    </div>
  );
};
