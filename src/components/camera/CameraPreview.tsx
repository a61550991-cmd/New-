import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CameraSettings, CameraMode, CapturedItem } from '../../types/camera';
import { GridOverlay } from './GridOverlay';
import { HorizonLevel } from './HorizonLevel';
import { HistogramOverlay } from './HistogramOverlay';
import { FocusRing } from './FocusRing';
import { FocusPeakingOverlay } from './FocusPeakingOverlay';
import { soundController } from '../../utils/audio';
import { applyLmcWatermark } from '../../utils/watermark';
import { AlertCircle, Video, CircleDot, Pause, Play, Camera as CameraIcon } from 'lucide-react';

interface CameraPreviewProps {
  settings: CameraSettings;
  mode: CameraMode;
  facingMode: 'environment' | 'user';
  zoom: number;
  exposure: number;
  onExposureChange: (exp: number) => void;
  onItemCaptured: (item: CapturedItem) => void;
  onRequestPermission: () => void;
  isSimulated: boolean;
  onToggleSimulated: () => void;
  onOpenConfigModal: () => void;
  isRecording: boolean;
  setIsRecording: (rec: boolean) => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  settings,
  mode,
  facingMode,
  zoom,
  exposure,
  onExposureChange,
  onItemCaptured,
  onRequestPermission,
  isSimulated,
  onToggleSimulated,
  onOpenConfigModal,
  isRecording,
  setIsRecording,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);
  const [isCapturingFlash, setIsCapturingFlash] = useState(false);

  // Video recording states
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);
  const recordingTimerRef = useRef<number | null>(null);

  // Initialize Camera Stream
  const startCamera = useCallback(async () => {
    if (isSimulated) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setHasPermission(true);
      setErrorMsg(null);
      return;
    }

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      setErrorMsg(null);
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: settings.videoResolution === '4k' ? 3840 : 1920 },
          height: { ideal: settings.videoResolution === '4k' ? 2160 : 1080 },
          frameRate: { ideal: settings.videoFps },
        },
        audio: true, // enable real mic audio for video recording
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setHasPermission(true);
    } catch (err: unknown) {
      console.warn('Camera access denied or unavailable', err);
      // Try video only if mic failed
      try {
        const videoOnly = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode } },
          audio: false,
        });
        streamRef.current = videoOnly;
        if (videoRef.current) {
          videoRef.current.srcObject = videoOnly;
          await videoRef.current.play();
        }
        setHasPermission(true);
      } catch (e) {
        const message = err instanceof Error ? err.message : 'Kamera tidak tersedia';
        setErrorMsg(message);
        setHasPermission(false);
      }
    }
  }, [facingMode, isSimulated, settings.videoResolution, settings.videoFps]);

  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [startCamera]);

  // Apply torch if supported
  useEffect(() => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && typeof (track as unknown as { getCapabilities?: () => { torch?: boolean } }).getCapabilities === 'function') {
        const capabilities = (track as unknown as { getCapabilities: () => { torch?: boolean } }).getCapabilities();
        if (capabilities.torch) {
          track.applyConstraints({
            advanced: [{ torch: settings.flashMode === 'torch' } as unknown as MediaTrackConstraintSet],
          }).catch(() => {
            // Hardware doesn't support torch
          });
        }
      }
    }
  }, [settings.flashMode]);

  // Simulation Canvas loop
  const simulationCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!isSimulated) return;

    let animId: number;
    let t = 0;
    const canvas = simulationCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderSimulation = () => {
      t += 0.015;
      const w = canvas.width;
      const h = canvas.height;

      // Realistic outdoor golden-hour gradient scene with gentle wind sway
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#111827');
      grad.addColorStop(0.35, '#1e293b');
      grad.addColorStop(0.65, '#c2410c'); // Warm dusk orange
      grad.addColorStop(0.85, '#ea580c');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Sun glow
      const sunX = w * 0.65;
      const sunY = h * 0.45;
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 200);
      sunGrad.addColorStop(0, 'rgba(254, 243, 199, 0.95)');
      sunGrad.addColorStop(0.3, 'rgba(251, 191, 36, 0.4)');
      sunGrad.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 200, 0, Math.PI * 2);
      ctx.fill();

      // Mountains
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.7);
      for (let x = 0; x <= w; x += 30) {
        const my = h * 0.65 + Math.sin(x * 0.005 + 1) * 60 + Math.cos(x * 0.01) * 30;
        ctx.lineTo(x, my);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Trees & Foliage sway
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.85);
      for (let x = 0; x <= w; x += 15) {
        const wave = Math.sin(t + x * 0.02) * 8;
        ctx.lineTo(x, h * 0.82 + wave);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      animId = requestAnimationFrame(renderSimulation);
    };

    animId = requestAnimationFrame(renderSimulation);
    return () => cancelAnimationFrame(animId);
  }, [isSimulated]);

  // Double tap detection for LMC Config dialog
  const lastTapRef = useRef<number>(0);
  const handleViewfinderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap detected! Open LMC XML Configs
      onOpenConfigModal();
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;

    // Single tap to focus
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setFocusPoint({ x, y });
    soundController.playTick();

    window.clearTimeout((window as unknown as { focusTimeout?: number }).focusTimeout);
    (window as unknown as { focusTimeout?: number }).focusTimeout = window.setTimeout(() => {
      setFocusPoint(null);
    }, 5000);
  };

  // Video Recording Logic
  const startRecording = useCallback(() => {
    let streamToRecord: MediaStream | null = streamRef.current;
    
    if (isSimulated && simulationCanvasRef.current) {
      // Capture stream from simulation canvas
      streamToRecord = (simulationCanvasRef.current as HTMLCanvasElement).captureStream(30);
    }

    if (!streamToRecord) return;

    try {
      recordedChunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
        ? 'video/webm;codecs=vp8,opus'
        : 'video/webm';

      const recorder = new MediaRecorder(streamToRecord, { mimeType });
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        
        // Save to gallery
        const newItem: CapturedItem = {
          id: Date.now().toString(),
          type: 'video',
          url: videoUrl,
          timestamp: new Date(),
          mode: mode,
          aspectRatio: settings.aspectRatio,
          zoom: zoom,
          hdr: 'HDR10 60fps',
          resolution: `${settings.videoResolution.toUpperCase()} · ${settings.videoFps}fps`,
          duration: recordingSeconds,
          lmcConfig: settings.lmcProfile,
        };
        onItemCaptured(newItem);
        setRecordingSeconds(0);
        setIsRecording(false);
        setIsRecordingPaused(false);
      };

      recorder.start(500); // 500ms chunk intervals
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setIsRecordingPaused(false);
      setRecordingSeconds(0);

      // Start elapsed timer
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start MediaRecorder:', err);
    }
  }, [isSimulated, mode, settings.aspectRatio, settings.videoResolution, settings.videoFps, settings.lmcProfile, zoom, recordingSeconds, onItemCaptured, setIsRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsRecordingPaused(true);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsRecordingPaused(false);
    }
  }, []);

  // Still Photo Capture
  const capturePhoto = useCallback(() => {
    setIsCapturingFlash(true);
    setTimeout(() => setIsCapturingFlash(false), 120);

    const canvas = document.createElement('canvas');
    if (isSimulated && simulationCanvasRef.current) {
      canvas.width = simulationCanvasRef.current.width;
      canvas.height = simulationCanvasRef.current.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(simulationCanvasRef.current, 0, 0);

        if (settings.watermark) {
          applyLmcWatermark({
            canvas,
            lmcProfile: settings.lmcProfile,
            customText: settings.watermarkCustomText,
            iso: settings.proSettings.iso === 'auto' ? 100 : settings.proSettings.iso,
            shutter: settings.proSettings.shutterSpeed === 'auto' ? '1/250s' : `${settings.proSettings.shutterSpeed}s`,
            zoom,
          });
        }

        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const newItem: CapturedItem = {
          id: Date.now().toString(),
          type: 'photo',
          url: dataUrl,
          timestamp: new Date(),
          mode: mode,
          aspectRatio: settings.aspectRatio,
          zoom: zoom,
          hdr: settings.hdrMode === 'plus' ? 'HDR+ Enhanced (25 frames)' : 'HDR Auto',
          resolution: settings.aspectRatio === '4:3' ? '4032 x 3024 (12.2MP)' : '3840 x 2160 (4K UHD)',
          lmcConfig: settings.lmcProfile,
          metadata: {
            iso: settings.proSettings.iso === 'auto' ? 100 : settings.proSettings.iso,
            shutter: settings.proSettings.shutterSpeed === 'auto' ? '1/250s' : `${settings.proSettings.shutterSpeed}s`,
            focalLength: zoom <= 0.8 ? '14mm' : zoom >= 3.0 ? '120mm' : '24mm',
            aperture: 'f/1.8',
            whiteBalance: settings.proSettings.whiteBalance === 'auto' ? '5500K (Google AWB)' : `${settings.proSettings.whiteBalance}K`,
          },
        };
        onItemCaptured(newItem);
      }
    } else if (videoRef.current && videoRef.current.videoWidth > 0) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (exposure !== 0) {
          ctx.filter = `brightness(${1 + exposure * 0.25})`;
        }
        ctx.drawImage(videoRef.current, 0, 0);

        if (settings.watermark) {
          applyLmcWatermark({
            canvas,
            lmcProfile: settings.lmcProfile,
            customText: settings.watermarkCustomText,
            iso: settings.proSettings.iso === 'auto' ? 100 : settings.proSettings.iso,
            shutter: settings.proSettings.shutterSpeed === 'auto' ? '1/250s' : `${settings.proSettings.shutterSpeed}s`,
            zoom,
          });
        }

        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const newItem: CapturedItem = {
          id: Date.now().toString(),
          type: 'photo',
          url: dataUrl,
          timestamp: new Date(),
          mode: mode,
          aspectRatio: settings.aspectRatio,
          zoom: zoom,
          hdr: settings.hdrMode === 'plus' ? 'HDR+ Enhanced (25 frames)' : 'HDR Auto',
          resolution: settings.aspectRatio === '4:3' ? '4032 x 3024 (12.2MP)' : '3840 x 2160 (4K UHD)',
          lmcConfig: settings.lmcProfile,
          metadata: {
            iso: settings.proSettings.iso === 'auto' ? 100 : settings.proSettings.iso,
            shutter: settings.proSettings.shutterSpeed === 'auto' ? '1/250s' : `${settings.proSettings.shutterSpeed}s`,
            focalLength: zoom <= 0.8 ? '14mm' : zoom >= 3.0 ? '120mm' : '24mm',
            aperture: 'f/1.8',
            whiteBalance: settings.proSettings.whiteBalance === 'auto' ? '5500K (Google AWB)' : `${settings.proSettings.whiteBalance}K`,
          },
        };
        onItemCaptured(newItem);
      }
    }
  }, [isSimulated, exposure, zoom, mode, settings, onItemCaptured]);

  // Expose triggers to window
  useEffect(() => {
    (window as unknown as { triggerYuCameraCapture?: () => void }).triggerYuCameraCapture = capturePhoto;
    (window as unknown as { triggerYuCameraStartRecord?: () => void }).triggerYuCameraStartRecord = startRecording;
    (window as unknown as { triggerYuCameraStopRecord?: () => void }).triggerYuCameraStopRecord = stopRecording;

    return () => {
      delete (window as unknown as { triggerYuCameraCapture?: () => void }).triggerYuCameraCapture;
      delete (window as unknown as { triggerYuCameraStartRecord?: () => void }).triggerYuCameraStartRecord;
      delete (window as unknown as { triggerYuCameraStopRecord?: () => void }).triggerYuCameraStopRecord;
    };
  }, [capturePhoto, startRecording, stopRecording]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getAspectRatioStyle = (): React.CSSProperties => {
    switch (settings.aspectRatio) {
      case '4:3':
        return { aspectRatio: '3/4', maxHeight: '100%', maxWidth: '100%' };
      case '16:9':
        return { aspectRatio: '9/16', maxHeight: '100%', maxWidth: '100%' };
      case '1:1':
        return { aspectRatio: '1/1', maxHeight: '100%', maxWidth: '100%' };
      case 'full':
      default:
        return { width: '100%', height: '100%' };
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none">
      {/* Aspect Ratio Framing Container */}
      <div
        ref={containerRef}
        onClick={handleViewfinderClick}
        style={getAspectRatioStyle()}
        className="relative overflow-hidden flex items-center justify-center bg-zinc-950 transition-all duration-300 shadow-2xl cursor-crosshair"
      >
        {/* Flash Burst Overlay */}
        {isCapturingFlash && (
          <div className="absolute inset-0 z-40 bg-white animate-[fadeOut_0.15s_ease-out] pointer-events-none" />
        )}

        {/* Live Camera Video Stream */}
        {!isSimulated && (
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="w-full h-full object-cover transition-transform duration-100 ease-out"
            style={{
              transform: `scale(${zoom})`,
              filter: `brightness(${1 + exposure * 0.25})`,
            }}
          />
        )}

        {/* Realistic Simulated Video Stream when simulation is active */}
        {isSimulated && (
          <canvas
            ref={simulationCanvasRef}
            width={1080}
            height={1440}
            className="w-full h-full object-cover transition-transform duration-100 ease-out"
            style={{
              transform: `scale(${zoom})`,
              filter: `brightness(${1 + exposure * 0.25})`,
            }}
          />
        )}

        {/* Focus Peaking Overlay */}
        <FocusPeakingOverlay
          enabled={settings.proSettings.focusPeaking}
          videoRef={videoRef}
        />

        {/* Grid composition overlay */}
        <GridOverlay type={settings.gridType} />

        {/* Artificial Horizon Level line */}
        <HorizonLevel visible={settings.horizonLevel} />

        {/* Tap to Focus Ring with Exposure Adjustment */}
        {focusPoint && (
          <FocusRing
            x={focusPoint.x}
            y={focusPoint.y}
            exposure={exposure}
            onExposureChange={onExposureChange}
            onClear={() => setFocusPoint(null)}
          />
        )}

        {/* Real-time Histogram */}
        <HistogramOverlay
          videoRef={isSimulated ? (simulationCanvasRef as unknown as React.RefObject<HTMLVideoElement | null>) : videoRef}
          visible={settings.histogram}
        />

        {/* LMC Viewfinder Telemetry Floating HUD (Top Left) */}
        <div className="absolute top-16 left-4 z-20 pointer-events-none flex flex-col gap-1">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono-nums text-slate-200">
            <span className="text-amber-400 font-bold">
              ISO {settings.proSettings.iso === 'auto' ? '100' : settings.proSettings.iso}
            </span>
            <span>·</span>
            <span>{settings.proSettings.shutterSpeed === 'auto' ? '1/125s' : `${settings.proSettings.shutterSpeed}s`}</span>
            <span>·</span>
            <span>f/1.8</span>
            <span>·</span>
            <span className="text-amber-300 font-semibold">
              {zoom <= 0.8 ? '14mm' : zoom >= 3 ? '120mm' : zoom >= 1.8 ? '50mm' : '24mm'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[9px] font-mono-nums text-white/70">
            <span className="px-1.5 py-0.2 rounded bg-black/40 border border-white/5 uppercase">
              {settings.lmcProfile.replace(/_/g, ' ')}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-black/40 border border-white/5">
              AWB: {settings.awbMode.toUpperCase()}
            </span>
          </div>
        </div>

        {/* VIDEO RECORDING ACTIVE HUD OVERLAY */}
        {isRecording && (
          <div className="absolute top-16 right-4 z-30 flex items-center gap-2">
            {/* Blinking REC badge with timer */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/90 text-white font-mono-nums text-xs font-bold shadow-lg shadow-red-900/40 animate-pulse">
              <CircleDot className="w-3.5 h-3.5 fill-white text-white" />
              <span>REC {formatTimer(recordingSeconds)}</span>
              <span className="text-[10px] font-normal opacity-80 border-l border-white/30 pl-1.5">
                {settings.videoResolution.toUpperCase()}
              </span>
            </div>

            {/* Pause / Resume Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isRecordingPaused) {
                  resumeRecording();
                } else {
                  pauseRecording();
                }
              }}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              title={isRecordingPaused ? 'Lanjut Rekam' : 'Jeda Rekam'}
            >
              {isRecordingPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
            </button>

            {/* Still Snapshot Button during video recording */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                capturePhoto();
              }}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform shadow-md"
              title="Ambil Foto Saat Rekam Video"
            >
              <CameraIcon className="w-4 h-4 text-black" />
            </button>
          </div>
        )}

        {/* Camera Error / Permission Banner */}
        {hasPermission === false && !isSimulated && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/85 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              Kamera Belum Terhubung
            </h4>
            <p className="text-xs text-slate-300 max-w-xs mb-4">
              {errorMsg || 'Izin kamera dibutuhkan untuk preview langsung.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={onRequestPermission}
                className="px-4 py-2 rounded-xl bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 transition-colors"
              >
                Coba Lagi
              </button>
              <button
                onClick={onToggleSimulated}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors"
              >
                Gunakan Simulasi
              </button>
            </div>
          </div>
        )}

        {/* Double-tap hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-[9px] font-mono-nums text-white/40 tracking-wider">
          Ketuk dua kali untuk buka LMC XML Configs
        </div>
      </div>
    </div>
  );
};
