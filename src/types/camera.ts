export type CameraMode = 
  | 'portrait'
  | 'photo'
  | 'video'
  | 'night'
  | 'pro'
  | 'panorama'
  | 'document'
  | 'slowmo'
  | 'timelapse';

export type AspectRatio = '4:3' | '16:9' | '1:1' | 'full';

export type FlashMode = 'off' | 'auto' | 'on' | 'torch';

export type GridType = 'none' | '3x3' | 'golden' | 'diagonal';

export type VideoResolution = '720p' | '1080p' | '4k';
export type VideoFps = 24 | 30 | 60 | 120;

export type LmcConfigProfile = 
  | 'leica_vibrant'
  | 'leica_authentic'
  | 'pixel_8_pro'
  | 'golden_hour'
  | 'astrophotography_pro';

export interface ProSettings {
  iso: number | 'auto'; // 'auto' or 50 - 3200
  shutterSpeed: string; // 'auto', '1/8000', '1/2000', '1/1000', '1/500', '1/250', '1/125', '1/60', '1/30', '1s', '2s', '4s', '8s', '16s', '32s'
  whiteBalance: number | 'auto'; // 'auto' or Kelvin 2500 - 9000
  focusDistance: number | 'auto'; // 'auto' or 0.0 (macro) to 1.0 (infinity)
  focusPeaking: boolean;
  meteringMode: 'matrix' | 'center' | 'spot';
}

export interface CameraSettings {
  aspectRatio: AspectRatio;
  flashMode: FlashMode;
  gridType: GridType;
  timer: 0 | 3 | 5 | 10;
  hdrMode: 'off' | 'auto' | 'plus';
  awbMode: 'off' | 'pixel' | 'sony';
  motionPhoto: boolean;
  astroMode: boolean;
  rawCapture: boolean;
  horizonLevel: boolean;
  histogram: boolean;
  shutterSound: boolean;
  saveLocation: boolean;
  gridOpacity: number;
  watermark: boolean;
  watermarkCustomText: string;
  videoResolution: VideoResolution;
  videoFps: VideoFps;
  videoStabilization: boolean;
  lmcProfile: LmcConfigProfile;
  activeFilter: 'original' | 'leica_monochrome' | 'kodak_portra' | 'fuji_chrome' | 'teal_orange' | 'vintage_film' | 'soft_portrait' | 'vivid_punch' | 'cyber_night';
  proSettings: ProSettings;
}

export interface CapturedItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  timestamp: Date;
  mode: CameraMode;
  aspectRatio: string;
  zoom: number;
  hdr: string;
  resolution: string;
  duration?: number; // In seconds for video
  lmcConfig?: string;
  metadata?: {
    iso?: number;
    shutter?: string;
    focalLength?: string;
    aperture?: string;
    whiteBalance?: string;
  };
}

export interface AndroidFile {
  path: string;
  name: string;
  language: 'kotlin' | 'groovy' | 'xml' | 'markdown' | 'properties';
  category: 'config' | 'manifest' | 'di' | 'domain' | 'viewmodel' | 'ui' | 'theme';
  content: string;
  description: string;
}
