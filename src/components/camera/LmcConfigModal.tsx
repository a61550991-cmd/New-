import React, { useState } from 'react';
import { X, Check, FileCode2, Upload, Sparkles, Sliders, Shield } from 'lucide-react';
import { LmcConfigProfile } from '../../types/camera';

interface LmcConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: LmcConfigProfile;
  onSelectProfile: (profile: LmcConfigProfile) => void;
}

interface ConfigItem {
  id: LmcConfigProfile;
  fileName: string;
  name: string;
  tag: string;
  desc: string;
  accentColor: string;
  tuning: {
    hdrFrames: number;
    sharpness: string;
    saturation: string;
    noiseReduction: string;
  };
}

const CONFIG_PROFILES: ConfigItem[] = [
  {
    id: 'leica_vibrant',
    fileName: 'LMC8.4_Leica_Vibrant_v3.xml',
    name: 'Leica Vibrant Colors',
    tag: 'POPULER',
    desc: 'Warna kontras tinggi khas Leica, saturasi merah/hijau kaya, vignetting halus, dan bayangan dalam.',
    accentColor: '#E53935',
    tuning: {
      hdrFrames: 25,
      sharpness: '+1.5 (Sabre ON)',
      saturation: '1.25x Vibrant',
      noiseReduction: 'Temporal Medium',
    },
  },
  {
    id: 'leica_authentic',
    fileName: 'LMC8.4_Leica_Authentic_M11.xml',
    name: 'Leica Authentic M11',
    tag: 'NATURAL',
    desc: 'Karakter analog klasik Leica M11. Gradasi tonal halus, highlight roll-off sinematik, warna realistis.',
    accentColor: '#D32F2F',
    tuning: {
      hdrFrames: 20,
      sharpness: '1.0x Flat',
      saturation: '1.0x Realistis',
      noiseReduction: 'Luma Soft',
    },
  },
  {
    id: 'pixel_8_pro',
    fileName: 'LMC8.4_Pixel8Pro_HDRNet.xml',
    name: 'Google Pixel 8 Pro Tone',
    tag: 'HDR NET',
    desc: 'Pemrosesan komputasional Google asli. Dynamic range ultra luas, bayangan terang tanpa noise, Google AWB.',
    accentColor: '#4285F4',
    tuning: {
      hdrFrames: 27,
      sharpness: 'Super Res Zoom',
      saturation: 'Google Natural',
      noiseReduction: 'Deep Neural AI',
    },
  },
  {
    id: 'golden_hour',
    fileName: 'LMC8.4_GoldenSunset_Warmth.xml',
    name: 'Golden Hour & Street Pro',
    tag: 'WARM TONE',
    desc: 'Optimasi khusus cahaya sore, senja, dan street photography. Menambah kehangatan amber & skin-tone lembut.',
    accentColor: '#FFB300',
    tuning: {
      hdrFrames: 18,
      sharpness: 'Medium-Crisp',
      saturation: 'Warm Amber +0.3',
      noiseReduction: 'High Detail',
    },
  },
  {
    id: 'astrophotography_pro',
    fileName: 'LMC8.4_Astro_MilkyWay_Exp32s.xml',
    name: 'Astrophotography & Night Max',
    tag: 'ASTRO 32s',
    desc: 'Multi-frame exposure hingga 32 detik. Deteksi bintang otomatis, dark-current subtraction, alignment langit malam.',
    accentColor: '#7C4DFF',
    tuning: {
      hdrFrames: 35,
      sharpness: 'Edge Protect',
      saturation: 'Astro Nebula Boost',
      noiseReduction: 'Hot Pixel Filter',
    },
  },
];

export const LmcConfigModal: React.FC<LmcConfigModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSelectProfile,
}) => {
  const [selected, setSelected] = useState<LmcConfigProfile>(currentProfile);
  const [customXmlName, setCustomXmlName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApply = () => {
    onSelectProfile(selected);
    onClose();
  };

  const handleUploadXml = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomXmlName(file.name);
      // Automatically choose vibrant as base
      setSelected('leica_vibrant');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="bg-[#101318] border border-white/15 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-[scaleIn_0.15s_ease-out]">
        {/* Header - Authentic LMC Hasli Dialog Style */}
        <div className="px-6 py-4 bg-[#151921] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <FileCode2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  LMC XML Config Loader
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono-nums font-bold">
                  LMC 8.4 R18
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pilih profil kurva warna & konfigurasi sensor kamera
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profiles List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {CONFIG_PROFILES.map((config) => {
            const isSelected = selected === config.id;
            return (
              <div
                key={config.id}
                onClick={() => setSelected(config.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#1b212b] border-amber-400/60 shadow-lg shadow-black/40'
                    : 'bg-[#13161c] border-white/10 hover:border-white/20 hover:bg-[#161a22]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: config.accentColor }}
                      />
                      <h4 className="text-sm font-bold text-white">
                        {config.name}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-slate-300 font-mono-nums">
                        {config.tag}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono-nums text-amber-400/90 font-medium">
                      /LMC8.4/{config.fileName}
                    </p>

                    <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                      {config.desc}
                    </p>

                    {/* Tuning pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[10px] text-slate-400 font-mono-nums">
                      <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5">
                        HDR+: {config.tuning.hdrFrames} frames
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5">
                        {config.tuning.sharpness}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5">
                        {config.tuning.saturation}
                      </span>
                    </div>
                  </div>

                  {/* Radio / Selection Indicator */}
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'bg-amber-400 border-amber-400 text-black'
                        : 'border-white/30 bg-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Custom XML Import area */}
          <div className="p-3.5 rounded-2xl bg-black/30 border border-dashed border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Upload className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-white">
                  Impor File XML Kustom
                </p>
                <p className="text-[10px] text-slate-400">
                  {customXmlName ? `File: ${customXmlName}` : 'Pilih file .xml dari penyimpanan perangkat'}
                </p>
              </div>
            </div>
            <label className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer transition-colors">
              Pilih XML
              <input
                type="file"
                accept=".xml"
                onChange={handleUploadXml}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-[#141820] border-t border-white/10 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Folder: <code className="text-amber-400 font-mono-nums">/sdcard/LMC8.4/</code>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Terapkan XML</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
