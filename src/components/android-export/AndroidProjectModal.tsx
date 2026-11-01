import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  X,
  Download,
  Copy,
  Check,
  FileCode,
  Folder,
  Layers,
  Terminal,
  BookOpen,
} from 'lucide-react';
import { ANDROID_PROJECT_FILES } from '../../android-codebase';
import { AndroidFile } from '../../types/camera';

interface AndroidProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidProjectModal: React.FC<AndroidProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<AndroidFile>(ANDROID_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add all files
      ANDROID_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add gradle wrapper properties file stub for quick open
      zip.file(
        'gradle/wrapper/gradle-wrapper.properties',
        `distributionBase=GRADLE_USER_HOME\ndistributionPath=wrapper/dists\ndistributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip\nzipStoreBase=GRADLE_USER_HOME\nzipStorePath=wrapper/dists\n`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'YuCamera-Android-Tahap1.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0f1217] border border-white/15 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#14181f]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  Android Studio Project · Tahap 1
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                  Setup + Camera Preview
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kotlin 2.0 · Jetpack Compose · CameraX + Camera2 Interop · Hilt MVVM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Mengompres...' : 'Download Proyek (.ZIP)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body: File Sidebar + Code View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-72 bg-[#12151b] border-r border-white/10 flex flex-col shrink-0">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                Struktur File Proyek ({ANDROID_PROJECT_FILES.length})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {ANDROID_PROJECT_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 text-xs transition-colors ${
                      isSelected
                        ? 'bg-amber-400/15 border border-amber-400/30 text-amber-300 font-medium'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <div className="truncate">
                      <p className="truncate font-mono-nums text-[11px]">{file.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{file.path}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Android build hint */}
            <div className="p-3 bg-black/40 border-t border-white/10 text-[11px] text-slate-400">
              <p className="font-semibold text-white mb-1 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-emerald-400" />
                Build APK:
              </p>
              <p className="font-mono-nums text-[10px] text-slate-400">./gradlew assembleDebug</p>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-[#0b0d11] overflow-hidden">
            {/* Code Header */}
            <div className="px-5 py-3 border-b border-white/10 bg-[#12151a] flex items-center justify-between">
              <div>
                <span className="font-mono-nums text-xs font-semibold text-amber-400">
                  {selectedFile.path}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {selectedFile.description}
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Salin Kode</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-4 font-mono-nums text-xs text-slate-200 bg-[#07090c] leading-relaxed select-text">
              <pre>
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
