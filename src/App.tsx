/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CameraSettings,
  CameraMode,
  CapturedItem,
  ProSettings,
  LmcConfigProfile,
} from './types/camera';
import { CameraPreview } from './components/camera/CameraPreview';
import { TopBar } from './components/camera/TopBar';
import { BottomBar } from './components/camera/BottomBar';
import { QuickSettingsDrawer } from './components/camera/QuickSettingsDrawer';
import { PermissionDialog } from './components/camera/PermissionDialog';
import { SplashScreen } from './components/camera/SplashScreen';
import { AndroidProjectModal } from './components/android-export/AndroidProjectModal';
import { GalleryModal } from './components/gallery/GalleryModal';
import { LmcConfigModal } from './components/camera/LmcConfigModal';
import { ProControlsBar } from './components/camera/ProControlsBar';
import { StepProgressBanner } from './components/StepProgressBanner';
import { soundController } from './utils/audio';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentMode, setCurrentMode] = useState<CameraMode>('photo');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [zoomRatio, setZoomRatio] = useState<number>(1.0);
  const [exposure, setExposure] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // LMC & Camera Settings
  const [settings, setSettings] = useState<CameraSettings>({
    aspectRatio: '4:3',
    flashMode: 'auto',
    gridType: '3x3',
    timer: 0,
    hdrMode: 'plus',
    awbMode: 'pixel',
    motionPhoto: true,
    astroMode: false,
    rawCapture: true,
    horizonLevel: true,
    histogram: true,
    shutterSound: true,
    saveLocation: true,
    gridOpacity: 0.25,
    watermark: true,
    watermarkCustomText: 'Yu Camera Pro',
    videoResolution: '1080p',
    videoFps: 60,
    videoStabilization: true,
    lmcProfile: 'leica_vibrant',
    proSettings: {
      iso: 'auto',
      shutterSpeed: 'auto',
      whiteBalance: 'auto',
      focusDistance: 'auto',
      focusPeaking: false,
      meteringMode: 'matrix',
    },
  });

  // UI Modals
  const [isQuickDrawerOpen, setIsQuickDrawerOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  // Gallery items (Photos & Videos)
  const [items, setItems] = useState<CapturedItem[]>([]);
  const [isTakingShot, setIsTakingShot] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const updateSettings = (newSettings: Partial<CameraSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateProSettings = (newPro: Partial<ProSettings>) => {
    setSettings((prev) => ({
      ...prev,
      proSettings: { ...prev.proSettings, ...newPro },
    }));
  };

  const handleFlipCamera = () => {
    soundController.playTick();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    setZoomRatio(1.0);
  };

  const handleSelectZoom = (zoom: number) => {
    soundController.playTick();
    setZoomRatio(zoom);
  };

  const handleSelectMode = (mode: CameraMode) => {
    soundController.playTick();
    // If we were recording and switch modes, stop recording first
    if (isRecording) {
      handleStopRecord();
    }
    setCurrentMode(mode);
  };

  const handleItemCaptured = (item: CapturedItem) => {
    if (item.type === 'photo') {
      if (settings.shutterSound) {
        soundController.playShutter();
      }
    } else {
      if (settings.shutterSound) {
        soundController.playVideoStop();
      }
    }
    setItems((prev) => [item, ...prev]);
    setIsTakingShot(false);
  };

  // Video recording triggers
  const handleStartRecord = () => {
    if (settings.shutterSound) {
      soundController.playVideoStart();
    }
    const fn = (window as unknown as { triggerYuCameraStartRecord?: () => void }).triggerYuCameraStartRecord;
    if (typeof fn === 'function') {
      fn();
    }
  };

  const handleStopRecord = () => {
    const fn = (window as unknown as { triggerYuCameraStopRecord?: () => void }).triggerYuCameraStopRecord;
    if (typeof fn === 'function') {
      fn();
    }
  };

  // Shutter action handler (differentiates photo vs video)
  const triggerShutter = () => {
    const isVideo = currentMode === 'video' || currentMode === 'slowmo' || currentMode === 'timelapse';

    if (isVideo) {
      if (isRecording) {
        handleStopRecord();
      } else {
        handleStartRecord();
      }
      return;
    }

    // Photo Mode: Handle timer countdown if enabled
    if (isTakingShot) return;

    if (settings.timer > 0) {
      setCountdown(settings.timer);
      let count = settings.timer;
      const interval = setInterval(() => {
        count--;
        soundController.playTick();
        if (count <= 0) {
          clearInterval(interval);
          setCountdown(null);
          executePhotoCapture();
        } else {
          setCountdown(count);
        }
      }, 1000);
    } else {
      executePhotoCapture();
    }
  };

  const executePhotoCapture = () => {
    setIsTakingShot(true);
    const triggerFn = (window as unknown as { triggerYuCameraCapture?: () => void }).triggerYuCameraCapture;
    if (typeof triggerFn === 'function') {
      triggerFn();
    } else {
      setIsTakingShot(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col overflow-hidden select-none">
      {/* 1. Splash Screen on first launch */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* 2. Workflow Stage Banner */}
      <StepProgressBanner onOpenCodeModal={() => setIsAndroidModalOpen(true)} />

      {/* 3. Main Camera Container */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-black flex items-center justify-center">
        {/* Top Controls Overlay */}
        <TopBar
          settings={settings}
          mode={currentMode}
          onUpdateSettings={updateSettings}
          onToggleQuickDrawer={() => setIsQuickDrawerOpen(true)}
          onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
          onOpenConfigModal={() => setIsConfigModalOpen(true)}
        />

        {/* Viewfinder Camera Stream */}
        <CameraPreview
          settings={settings}
          mode={currentMode}
          facingMode={facingMode}
          zoom={zoomRatio}
          exposure={exposure}
          onExposureChange={setExposure}
          onItemCaptured={handleItemCaptured}
          onRequestPermission={() => setIsPermissionDialogOpen(true)}
          isSimulated={isSimulated}
          onToggleSimulated={() => setIsSimulated(!isSimulated)}
          onOpenConfigModal={() => setIsConfigModalOpen(true)}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />

        {/* Pro Controls Bar (Visible in Pro mode or when toggled) */}
        {currentMode === 'pro' && (
          <ProControlsBar
            proSettings={settings.proSettings}
            onUpdateProSettings={updateProSettings}
            rawEnabled={settings.rawCapture}
            onToggleRaw={() => updateSettings({ rawCapture: !settings.rawCapture })}
          />
        )}

        {/* Countdown Indicator during photo timer */}
        {countdown !== null && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none">
            <span className="text-8xl font-black text-amber-400 font-mono-nums animate-ping">
              {countdown}
            </span>
          </div>
        )}

        {/* Bottom LMC Control Bar */}
        <BottomBar
          currentMode={currentMode}
          onSelectMode={handleSelectMode}
          zoomRatio={zoomRatio}
          onSelectZoom={handleSelectZoom}
          onShutterClick={triggerShutter}
          onFlipCamera={handleFlipCamera}
          onOpenGallery={() => setIsGalleryOpen(true)}
          onOpenConfigModal={() => setIsConfigModalOpen(true)}
          lastCapturedUrl={items[0]?.url || null}
          capturedCount={items.length}
          isTakingShot={isTakingShot}
          isRecording={isRecording}
        />
      </div>

      {/* 4. Quick Settings Drawer */}
      <QuickSettingsDrawer
        isOpen={isQuickDrawerOpen}
        onClose={() => setIsQuickDrawerOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
      />

      {/* 5. LMC XML Configs Modal */}
      <LmcConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        currentProfile={settings.lmcProfile}
        onSelectProfile={(p: LmcConfigProfile) => updateSettings({ lmcProfile: p })}
      />

      {/* 6. Android Studio Full Project & Code Modal */}
      <AndroidProjectModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />

      {/* 7. Gallery Modal (Photos & Playable Videos) */}
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        items={items}
        onDeleteItem={handleDeleteItem}
      />

      {/* 8. Permission Explanation Dialog */}
      <PermissionDialog
        isOpen={isPermissionDialogOpen}
        onGrant={() => {
          setIsPermissionDialogOpen(false);
          setIsSimulated(false);
        }}
        onUseSimulation={() => {
          setIsPermissionDialogOpen(false);
          setIsSimulated(true);
        }}
      />
    </div>
  );
}
