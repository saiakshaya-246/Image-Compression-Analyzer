import { Download, RefreshCw, Sliders, Sparkles, FileDown } from 'lucide-react';
import { OutputFormat } from '../types';

interface ControlSliderProps {
  quality: number;
  onQualityChange: (value: number) => void;
  format: OutputFormat;
  onFormatChange: (value: OutputFormat) => void;
  onDownload: () => void;
  onReset: () => void;
  downloadFilename: string;
}

export default function ControlSlider({
  quality,
  onQualityChange,
  format,
  onFormatChange,
  onDownload,
  onReset,
  downloadFilename,
}: ControlSliderProps) {
  const getQualityMessage = (q: number) => {
    if (q >= 90) return { label: 'Ultra High Quality 🌟', desc: 'Virtually indistinguishable from source. Minimal file saving.', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (q >= 75) return { label: 'High Quality (Recommended) ✨', desc: 'Best balance of visual fidelity and optimal file savings.', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    if (q >= 50) return { label: 'Balanced (Medium) ⚖️', desc: 'Moderate compression artifacts may be visible on high-contrast edges.', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (q >= 25) return { label: 'High Compression (Low) 📉', desc: 'Noticeable artifacts, significant file savings. Ideal for swift web previews.', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { label: 'Extreme Compression ⚠️', desc: 'Heavy visual artifacts. Absolute minimum file footprint.', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const msg = getQualityMessage(quality);

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* QUALITY SLIDER & FORMAT CHANNELS: 7/12 width */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                <Sliders className="w-4 h-4 text-indigo-500" />
                Compression Quality
              </label>
              <span className={`text-xs sm:text-sm font-black px-3.5 py-1 rounded-full ${msg.color} border shadow-sm transition-all duration-300`}>
                {quality}%
              </span>
            </div>

            {/* Slider input */}
            <div className="relative group py-2">
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => onQualityChange(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              
              {/* Slider tick presets */}
              <div className="flex justify-between text-[10px] text-slate-400 font-extrabold uppercase mt-3.5 px-1 select-none">
                <button onClick={() => onQualityChange(10)} className="hover:text-rose-500 transition-colors flex flex-col items-center gap-0.5">
                  <span>10%</span>
                  <span className="text-[8px] font-semibold text-slate-300">Min</span>
                </button>
                <button onClick={() => onQualityChange(30)} className="hover:text-orange-500 transition-colors flex flex-col items-center gap-0.5">
                  <span>30%</span>
                  <span className="text-[8px] font-semibold text-slate-300">Low</span>
                </button>
                <button onClick={() => onQualityChange(50)} className="hover:text-amber-500 transition-colors flex flex-col items-center gap-0.5">
                  <span>50%</span>
                  <span className="text-[8px] font-semibold text-slate-300">Mid</span>
                </button>
                <button onClick={() => onQualityChange(80)} className="hover:text-indigo-600 transition-colors flex flex-col items-center gap-0.5 font-black text-indigo-500">
                  <span>80%</span>
                  <span className="text-[8px] font-bold text-indigo-400">Rec</span>
                </button>
                <button onClick={() => onQualityChange(95)} className="hover:text-emerald-500 transition-colors flex flex-col items-center gap-0.5">
                  <span>95%</span>
                  <span className="text-[8px] font-semibold text-slate-300">Max</span>
                </button>
              </div>
            </div>

            {/* Quality Label Callout */}
            <div className="mt-4 bg-gradient-to-r from-slate-50 to-indigo-50/20 rounded-2xl p-4 border border-indigo-100/30 shadow-inner">
              <h5 className="text-xs font-black text-slate-800 mb-0.5">{msg.label}</h5>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">{msg.desc}</p>
            </div>
          </div>

          {/* Format Picker */}
          <div>
            <span className="text-xs sm:text-sm font-black text-slate-800 block mb-3 uppercase tracking-wide">Output Image Format</span>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onFormatChange('image/jpeg')}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  format === 'image/jpeg'
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-50/40 to-indigo-50/10 text-indigo-950 shadow-md ring-2 ring-indigo-500/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs">JPEG Format</span>
                  {format === 'image/jpeg' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                </div>
                <span className="text-[10px] text-slate-400 mt-1.5 font-semibold leading-normal">Standard choice for photography and high detail</span>
              </button>

              <button
                type="button"
                onClick={() => onFormatChange('image/webp')}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  format === 'image/webp'
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-50/40 to-indigo-50/10 text-indigo-950 shadow-md ring-2 ring-indigo-500/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    WebP Format
                    <span className="text-[8px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-md font-bold uppercase">Modern</span>
                  </span>
                  {format === 'image/webp' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                </div>
                <span className="text-[10px] text-slate-400 mt-1.5 font-semibold leading-normal">Next-gen codec. Superior savings & transparent alpha support</span>
              </button>
            </div>
          </div>
        </div>

        {/* EXPORT CONTROL PANEL: 5/12 width */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-50/80 to-indigo-50/30 rounded-3xl p-6 border border-slate-200/50 flex flex-col justify-between h-full min-h-[240px] relative overflow-hidden group">
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-indigo-100/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" /> Export Destination
            </h4>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 mb-4 shadow-sm">
              <span className="text-[9px] text-slate-400 block font-extrabold uppercase tracking-wider mb-0.5">Target Filename</span>
              <span className="font-mono text-xs font-bold text-indigo-950 break-all select-all">
                {downloadFilename}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-semibold leading-relaxed mb-4">
              Write optimized pixels to memory. Click Download to trigger a secure client-side browser save action.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 relative z-10">
            <button
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl transition shadow-sm active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              Upload New
            </button>
            
            <button
              onClick={onDownload}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl transition shadow-md shadow-indigo-100/50 hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              Download Image
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
