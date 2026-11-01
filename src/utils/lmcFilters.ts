import { LmcConfigProfile } from '../types/camera';

export type CameraFilterId =
  | 'original'
  | 'leica_monochrome'
  | 'kodak_portra'
  | 'fuji_chrome'
  | 'teal_orange'
  | 'vintage_film'
  | 'soft_portrait'
  | 'vivid_punch'
  | 'cyber_night';

export interface CameraFilter {
  id: CameraFilterId;
  name: string;
  category: 'leica' | 'film' | 'art' | 'clean';
  cssFilter: string;
  vignette: number; // 0 to 1
  contrastBoost: number;
  colorTone: string;
  desc: string;
}

export const CAMERA_FILTERS: CameraFilter[] = [
  {
    id: 'original',
    name: 'Asli (XML Murni)',
    category: 'clean',
    cssFilter: 'none',
    vignette: 0,
    contrastBoost: 1.0,
    colorTone: '#ffffff',
    desc: 'Warna standar sesuai profil XML LMC',
  },
  {
    id: 'leica_monochrome',
    name: 'Leica B&W High Contrast',
    category: 'leica',
    cssFilter: 'grayscale(1) contrast(1.45) brightness(0.95)',
    vignette: 0.35,
    contrastBoost: 1.45,
    colorTone: '#333333',
    desc: 'Hitam-putih dramatis dengan kontras tajam ala Leica Monochrom M11',
  },
  {
    id: 'kodak_portra',
    name: 'Kodak Portra 400',
    category: 'film',
    cssFilter: 'sepia(0.18) saturate(1.15) contrast(1.08) brightness(1.04) hue-rotate(-5deg)',
    vignette: 0.15,
    contrastBoost: 1.08,
    colorTone: '#ffcc99',
    desc: 'Tone warna kulit hangat, bayangan creamy lembut khas rol film analog',
  },
  {
    id: 'fuji_chrome',
    name: 'Fuji Classic Chrome',
    category: 'film',
    cssFilter: 'saturate(0.85) contrast(1.22) brightness(0.98) hue-rotate(5deg)',
    vignette: 0.25,
    contrastBoost: 1.22,
    colorTone: '#99bbcc',
    desc: 'Warna muted desaturasi dengan langit biru tua dan tone sinematik documentary',
  },
  {
    id: 'teal_orange',
    name: 'Cinema Teal & Orange',
    category: 'art',
    cssFilter: 'contrast(1.25) saturate(1.3) hue-rotate(-12deg)',
    vignette: 0.3,
    contrastBoost: 1.25,
    colorTone: '#00cccc',
    desc: 'Gradasi film blockbuster Hollywood: kulit jingga dan bayangan biru toska',
  },
  {
    id: 'vintage_film',
    name: 'Vintage 90s Film',
    category: 'film',
    cssFilter: 'sepia(0.3) saturate(1.2) contrast(1.12) brightness(0.96) hue-rotate(-8deg)',
    vignette: 0.4,
    contrastBoost: 1.12,
    colorTone: '#d4a373',
    desc: 'Nuansa nostalgia kamera saku 90-an dengan grain dan vignetting kental',
  },
  {
    id: 'soft_portrait',
    name: 'Soft Glow Beauty',
    category: 'art',
    cssFilter: 'brightness(1.08) contrast(0.95) saturate(1.12)',
    vignette: 0.1,
    contrastBoost: 0.95,
    colorTone: '#ffb5a7',
    desc: 'Mencerahkan dan melembutkan tekstur kulit wajah secara alami',
  },
  {
    id: 'vivid_punch',
    name: 'Ultra Vivid Pop',
    category: 'art',
    cssFilter: 'saturate(1.55) contrast(1.25) brightness(1.02)',
    vignette: 0.2,
    contrastBoost: 1.25,
    colorTone: '#ff007f',
    desc: 'Warna dedaunan, bunga, dan pemandangan meledak cerah dan berani',
  },
  {
    id: 'cyber_night',
    name: 'Cyberpunk Neon',
    category: 'art',
    cssFilter: 'contrast(1.35) saturate(1.4) hue-rotate(25deg) brightness(0.9)',
    vignette: 0.45,
    contrastBoost: 1.35,
    colorTone: '#9d4edd',
    desc: 'Efek malam neon futuristik untuk fotografi lampu kota malam',
  },
];

/**
 * Menghasilkan CSS filter gabungan dari XML Profile LMC + Active Filter + Exposure
 * Dijalankan langsung oleh GPU browser (Hardware Accelerated) sehingga 0% lag!
 */
export function computeCombinedFilter(
  lmcProfile: LmcConfigProfile,
  filterId: CameraFilterId,
  exposure: number,
  kelvinWb: number | 'auto'
): string {
  const parts: string[] = [];

  // 1. Exposure brightness adjustment
  const expFactor = 1 + exposure * 0.22;
  if (Math.abs(expFactor - 1) > 0.01) {
    parts.push(`brightness(${expFactor.toFixed(2)})`);
  }

  // 2. LMC XML Profile Base Color Grading
  switch (lmcProfile) {
    case 'leica_vibrant':
      // Punchy Leica contrast, boosted reds and greens, deep shadows
      parts.push('contrast(1.22)', 'saturate(1.28)', 'brightness(0.98)');
      break;
    case 'leica_authentic':
      // Smooth filmic tonal roll-off, organic analogue warmth
      parts.push('contrast(1.12)', 'saturate(1.04)', 'sepia(0.08)');
      break;
    case 'pixel_8_pro':
      // Google HDR+ look: lifted dynamic range, vivid but neutral, cool clear sky
      parts.push('contrast(1.08)', 'saturate(1.15)', 'brightness(1.05)', 'hue-rotate(2deg)');
      break;
    case 'golden_hour':
      // Rich golden amber glow, warmth in midtones
      parts.push('sepia(0.25)', 'saturate(1.35)', 'contrast(1.15)', 'brightness(1.04)', 'hue-rotate(-8deg)');
      break;
    case 'astrophotography_pro':
      // Deep midnight indigo sky, high contrast, nebula boost
      parts.push('contrast(1.42)', 'saturate(1.3)', 'brightness(0.92)', 'hue-rotate(15deg)');
      break;
    default:
      break;
  }

  // 3. Manual White Balance Kelvin Adjustment if not auto
  if (kelvinWb !== 'auto') {
    if (kelvinWb < 4500) {
      // Warm tungsten/amber
      parts.push(`sepia(${((4500 - kelvinWb) / 4500 * 0.35).toFixed(2)})`);
      parts.push('hue-rotate(-5deg)');
    } else if (kelvinWb > 6500) {
      // Cool blue shade
      parts.push(`hue-rotate(${Math.min(20, (kelvinWb - 6500) / 200).toFixed(0)}deg)`);
    }
  }

  // 4. Creative Filter Layer (if chosen)
  const activeFilter = CAMERA_FILTERS.find((f) => f.id === filterId);
  if (activeFilter && activeFilter.id !== 'original') {
    parts.push(activeFilter.cssFilter);
  }

  return parts.length > 0 ? parts.join(' ') : 'none';
}

/**
 * Menghitung tingkat vignetting berdasarkan profil XML dan Filter
 */
export function computeVignetteIntensity(
  lmcProfile: LmcConfigProfile,
  filterId: CameraFilterId
): number {
  let v = 0;
  if (lmcProfile === 'leica_vibrant') v += 0.22;
  if (lmcProfile === 'leica_authentic') v += 0.18;
  if (lmcProfile === 'golden_hour') v += 0.2;
  if (lmcProfile === 'astrophotography_pro') v += 0.35;

  const f = CAMERA_FILTERS.find((item) => item.id === filterId);
  if (f) v += f.vignette;

  return Math.min(0.7, v);
}
