import { LmcConfigProfile } from '../types/camera';

interface WatermarkOptions {
  canvas: HTMLCanvasElement;
  lmcProfile: LmcConfigProfile;
  customText?: string;
  iso?: number | string;
  shutter?: string;
  zoom?: number;
}

export function applyLmcWatermark({
  canvas,
  lmcProfile,
  customText = 'Yu Camera Pro',
  iso = 100,
  shutter = '1/250s',
  zoom = 1.0,
}: WatermarkOptions): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Scale relative to canvas resolution
  const scale = Math.max(1, w / 1200);
  const barHeight = Math.round(90 * scale);
  const paddingX = Math.round(36 * scale);
  const fontSizeMain = Math.round(18 * scale);
  const fontSizeSub = Math.round(13 * scale);

  // Gradient bottom scrim for clear contrast
  const scrimGrad = ctx.createLinearGradient(0, h - barHeight - 20, 0, h);
  scrimGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  scrimGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.6)');
  scrimGrad.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
  ctx.fillStyle = scrimGrad;
  ctx.fillRect(0, h - barHeight - 20, w, barHeight + 20);

  // Red Leica / Gold LMC Circle Badge
  const badgeRadius = Math.round(14 * scale);
  const badgeX = paddingX + badgeRadius;
  const badgeY = h - Math.round(45 * scale);

  const isLeica = lmcProfile.includes('leica');
  ctx.fillStyle = isLeica ? '#E53935' : '#FFB300';
  ctx.beginPath();
  ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
  ctx.fill();

  // Monogram inside circle
  ctx.fillStyle = isLeica ? '#FFFFFF' : '#000000';
  ctx.font = `bold ${Math.round(11 * scale)}px 'Plus Jakarta Sans', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(isLeica ? 'Leica' : 'LMC', badgeX, badgeY);

  // Left Typography: Brand & Model
  const textLeftX = badgeX + badgeRadius + Math.round(16 * scale);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Primary text: "LMC 8.4 R18 | Shot on Yu Camera"
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `600 ${fontSizeMain}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillText(`LMC 8.4 R18 · Shot on ${customText}`, textLeftX, badgeY - Math.round(4 * scale));

  // Date and Profile subtext
  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const profileName = lmcProfile.replace(/_/g, ' ').toUpperCase();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.font = `400 ${fontSizeSub}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillText(`${dateStr} · XML: ${profileName}`, textLeftX, badgeY + Math.round(18 * scale));

  // Right Typography: Camera Technical Specs (Lens, Shutter, ISO)
  const textRightX = w - paddingX;
  ctx.textAlign = 'right';

  const focalLength = zoom <= 0.8 ? '14mm' : zoom >= 3.0 ? '120mm' : zoom >= 1.8 ? '50mm' : '24mm';
  const aperture = 'f/1.8';

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `600 ${fontSizeMain}px 'JetBrains Mono', monospace`;
  ctx.fillText(`${focalLength} ${aperture}`, textRightX, badgeY - Math.round(4 * scale));

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.font = `400 ${fontSizeSub}px 'JetBrains Mono', monospace`;
  ctx.fillText(`${shutter} · ISO ${iso}`, textRightX, badgeY + Math.round(18 * scale));
}
