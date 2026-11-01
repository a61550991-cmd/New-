import React, { useEffect, useRef } from 'react';

interface FocusPeakingOverlayProps {
  enabled: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const FocusPeakingOverlay: React.FC<FocusPeakingOverlayProps> = ({
  enabled,
  videoRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sampleCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let timerId: number;

    const sample = sampleCanvasRef.current || document.createElement('canvas');
    sample.width = 120;
    sample.height = 90;
    sampleCanvasRef.current = sample;
    const sCtx = sample.getContext('2d', { willReadFrequently: true });

    const detectEdges = () => {
      const video = videoRef.current;
      const outCanvas = canvasRef.current;

      if (video && outCanvas && sCtx && video.readyState >= 2) {
        const outCtx = outCanvas.getContext('2d');
        if (outCtx) {
          try {
            sCtx.drawImage(video, 0, 0, 120, 90);
            const imgData = sCtx.getImageData(0, 0, 120, 90);
            const data = imgData.data;

            outCanvas.width = 240;
            outCanvas.height = 180;
            outCtx.clearRect(0, 0, 240, 180);
            outCtx.strokeStyle = '#00FF66';
            outCtx.lineWidth = 1;

            const w = 120;
            const h = 90;
            const scaleX = 240 / w;
            const scaleY = 180 / h;

            outCtx.beginPath();
            for (let y = 2; y < h - 2; y += 3) {
              for (let x = 2; x < w - 2; x += 3) {
                const idx = (y * w + x) * 4;
                const rightIdx = (y * w + (x + 1)) * 4;
                const downIdx = ((y + 1) * w + x) * 4;

                const luma = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
                const lumaR = 0.299 * data[rightIdx] + 0.587 * data[rightIdx + 1] + 0.114 * data[rightIdx + 2];
                const lumaD = 0.299 * data[downIdx] + 0.587 * data[downIdx + 1] + 0.114 * data[downIdx + 2];

                if (Math.abs(luma - lumaR) + Math.abs(luma - lumaD) > 65) {
                  outCtx.rect(x * scaleX, y * scaleY, scaleX * 1.5, scaleY * 1.5);
                }
              }
            }
            outCtx.stroke();
          } catch {
            // ignore
          }
        }
      }
    };

    timerId = window.setInterval(detectEdges, 150);
    return () => clearInterval(timerId);
  }, [enabled, videoRef]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-15 mix-blend-screen opacity-75"
    />
  );
};
