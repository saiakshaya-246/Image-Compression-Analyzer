import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sliders, Sparkles, Check, Play } from 'lucide-react';

interface DropzoneProps {
  onImageSelected: (file: File | null, customUrl?: string, customName?: string) => void;
}

export default function Dropzone({ onImageSelected }: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingPreset, setLoadingPreset] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onImageSelected(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Generate local high-fidelity canvas test images to guarantee 100% CORS compliance & instant offline demo
  const loadDynamicTestPattern = (type: 'geometry' | 'gradient' | 'nature') => {
    setLoadingPreset(type);
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 900;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (type === 'geometry') {
        // Technical calibration pattern
        // Background grid
        ctx.fillStyle = '#1e293b'; // slate-800
        ctx.fillRect(0, 0, 1200, 900);

        ctx.strokeStyle = '#334155'; // slate-700
        ctx.lineWidth = 1;
        for (let i = 0; i < 1200; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 900);
          ctx.stroke();
        }
        for (let j = 0; j < 900; j += 40) {
          ctx.beginPath();
          ctx.moveTo(0, j);
          ctx.lineTo(1200, j);
          ctx.stroke();
        }

        // Concentric circles (tests high frequency compression)
        ctx.strokeStyle = '#38bdf8'; // sky-400
        ctx.lineWidth = 2;
        for (let r = 50; r <= 300; r += 20) {
          ctx.beginPath();
          ctx.arc(600, 450, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Radial rays
        ctx.strokeStyle = '#f43f5e'; // rose-500
        ctx.lineWidth = 1.5;
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) {
          ctx.beginPath();
          ctx.moveTo(600, 450);
          ctx.lineTo(
            600 + Math.cos(angle) * 350,
            450 + Math.sin(angle) * 350
          );
          ctx.stroke();
        }

        // Colored swatches (sharp gradients)
        const colors = ['#e11d48', '#2563eb', '#16a34a', '#ca8a04', '#7c3aed', '#0891b2', '#ea580c', '#ffffff'];
        colors.forEach((color, idx) => {
          ctx.fillStyle = color;
          ctx.fillRect(50 + idx * 130, 750, 110, 80);
          // High contrast borders
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.strokeRect(50 + idx * 130, 750, 110, 80);
        });

        // Sharp details and fine text for JPEG blockiness visualization
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('COMPRESSION CALIBRATION TARGET', 600, 80);

        ctx.font = '18px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Sharp borders, thin rays, and flat colors are optimal for inspecting JPEG halo artifacts.', 600, 120);

        // Center visual blocker
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(600, 450, 40, 0, Math.PI * 2);
        ctx.fill();

      } else if (type === 'gradient') {
        // High fidelity multicolor gradient mesh
        const gradient = ctx.createRadialGradient(600, 450, 50, 600, 450, 700);
        gradient.addColorStop(0, '#f472b6'); // pink-400
        gradient.addColorStop(0.2, '#818cf8'); // indigo-400
        gradient.addColorStop(0.4, '#34d399'); // emerald-400
        gradient.addColorStop(0.7, '#fbbf24'); // amber-400
        gradient.addColorStop(1, '#3b82f6'); // blue-500
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1200, 900);

        // Draw multiple smooth glowing spheres to test color banding
        for (let i = 0; i < 15; i++) {
          const x = 100 + Math.random() * 1000;
          const y = 100 + Math.random() * 700;
          const r = 80 + Math.random() * 120;
          
          const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
          glow.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
          glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 42px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ULTRA SMOOTH COLOR GRADIENTS', 600, 420);
        
        ctx.font = '18px sans-serif';
        ctx.fillStyle = '#334155';
        ctx.fillText('Inspect color banding (contours) in smooth, low-frequency regions.', 600, 470);

      } else {
        // Stylized synthetic landscape
        // Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 500);
        skyGrad.addColorStop(0, '#0f172a');
        skyGrad.addColorStop(1, '#3b0764');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 1200, 900);

        // Stars
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * 1200;
          const y = Math.random() * 500;
          const size = Math.random() * 2 + 0.5;
          ctx.fillRect(x, y, size, size);
        }

        // Neon grid hills
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.moveTo(0, 900);
        ctx.bezierCurveTo(300, 500, 500, 700, 1200, 900);
        ctx.fill();

        // Sunset sun
        const sunGrad = ctx.createLinearGradient(600, 300, 600, 600);
        sunGrad.addColorStop(0, '#f43f5e');
        sunGrad.addColorStop(1, '#eab308');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(600, 500, 150, 0, Math.PI * 2);
        ctx.fill();

        // Foreground mountain silhouettes
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.moveTo(0, 900);
        ctx.lineTo(250, 600);
        ctx.lineTo(500, 780);
        ctx.lineTo(850, 520);
        ctx.lineTo(1200, 900);
        ctx.closePath();
        ctx.fill();

        // Grid lines on landscape
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1;
        for (let x = 0; x < 1200; x += 100) {
          ctx.beginPath();
          ctx.moveTo(x, 650 + (x % 3) * 50);
          ctx.lineTo(600, 900);
          ctx.stroke();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SYNTHWAVE VECTOR LANDSCAPE', 600, 200);
      }

      // Convert canvas to dynamic DataURL and feed back
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${type}_preset.png`, { type: 'image/png' });
          onImageSelected(file);
        }
        setLoadingPreset(null);
      }, 'image/png');
    }, 400);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight mb-3">
          <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 bg-clip-text text-transparent">
            Image Optimizer Studio
          </span>
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
          Upload any file to analyze compression levels side-by-side. Inspect micro-details with synchronized zooming, and analyze quality loss using exact real-time mathematical PSNR.
        </p>
      </div>

      <div
        id="upload-dropzone"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all duration-300 min-h-[340px] bg-white cursor-pointer group ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50/40 scale-[1.01] shadow-xl shadow-indigo-100/50'
            : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/30 hover:shadow-lg hover:shadow-indigo-50/20'
        }`}
        onClick={onButtonClick}
      >
        {/* Glow effect backdrops */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 blur" />

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 rounded-2xl mb-4 group-hover:scale-110 transition-all duration-300 shadow-sm border border-indigo-100/30">
          <Upload className="w-8 h-8 text-indigo-600" />
        </div>

        <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-indigo-900 transition-colors">
          Drag & drop your image here
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-6 text-center max-w-sm font-semibold">
          Supports PNG, JPEG, WebP, SVG, and GIF up to 25MB. Local-only compression.
        </p>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl transition shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 active:scale-95"
        >
          Select Local File
        </button>
      </div>

      {/* Preset / Demo Images */}
      <div className="mt-10 border border-slate-100/80 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-50/80 to-white/90 shadow-sm relative overflow-hidden">
        <div className="absolute -right-24 -bottom-24 w-48 h-48 bg-indigo-50/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -top-24 w-48 h-48 bg-rose-50/30 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            No images on hand? Try our mathematical calibration targets
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
          
          {/* Preset 1: Grid */}
          <button
            disabled={loadingPreset !== null}
            onClick={(e) => { e.stopPropagation(); loadDynamicTestPattern('geometry'); }}
            className="flex items-center justify-between p-4 bg-white/80 border border-slate-200/80 rounded-2xl hover:border-indigo-400 hover:bg-white hover:shadow-md transition-all text-left group disabled:opacity-50"
          >
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 group-hover:text-indigo-600 transition-colors">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Calibration Grid
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                Perfect for inspecting JPEG compression halo artifacts.
              </div>
            </div>
            <div className="p-2 bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 rounded-xl transition-all shrink-0 ml-2">
              {loadingPreset === 'geometry' ? (
                <span className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
            </div>
          </button>

          {/* Preset 2: Gradient */}
          <button
            disabled={loadingPreset !== null}
            onClick={(e) => { e.stopPropagation(); loadDynamicTestPattern('gradient'); }}
            className="flex items-center justify-between p-4 bg-white/80 border border-slate-200/80 rounded-2xl hover:border-emerald-400 hover:bg-white hover:shadow-md transition-all text-left group disabled:opacity-50"
          >
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 group-hover:text-emerald-600 transition-colors">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Color Gradients
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                Tests banding, contouring, & color space accuracy.
              </div>
            </div>
            <div className="p-2 bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 rounded-xl transition-all shrink-0 ml-2">
              {loadingPreset === 'gradient' ? (
                <span className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin inline-block" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
            </div>
          </button>

          {/* Preset 3: Nature/Sunset */}
          <button
            disabled={loadingPreset !== null}
            onClick={(e) => { e.stopPropagation(); loadDynamicTestPattern('nature'); }}
            className="flex items-center justify-between p-4 bg-white/80 border border-slate-200/80 rounded-2xl hover:border-rose-400 hover:bg-white hover:shadow-md transition-all text-left group disabled:opacity-50"
          >
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 group-hover:text-rose-600 transition-colors">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Vector Sunset
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                Highly-saturated curves & extreme color contrast.
              </div>
            </div>
            <div className="p-2 bg-slate-50 text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500 rounded-xl transition-all shrink-0 ml-2">
              {loadingPreset === 'nature' ? (
                <span className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin inline-block" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}
