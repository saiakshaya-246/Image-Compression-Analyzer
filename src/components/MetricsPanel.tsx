import { FileText, Percent, Info, Clock, AlertCircle, Activity, HeartCrack, Layers } from 'lucide-react';
import { ImageDetails, CompressedDetails, ComparisonMetrics } from '../types';
import { formatBytes } from '../utils/image';

interface MetricsPanelProps {
  original: ImageDetails;
  compressed: CompressedDetails;
  metrics: ComparisonMetrics | null;
}

export default function MetricsPanel({ original, compressed, metrics }: MetricsPanelProps) {
  if (!metrics) return null;

  const getFidelityColor = (rating: string) => {
    switch (rating) {
      case 'Perfect':
        return { 
          text: 'text-emerald-700', 
          bg: 'bg-emerald-50/80', 
          border: 'border-emerald-200/60',
          gradient: 'from-emerald-500/10 to-teal-500/5'
        };
      case 'Excellent':
        return { 
          text: 'text-teal-700', 
          bg: 'bg-teal-50/80', 
          border: 'border-teal-200/60',
          gradient: 'from-teal-500/10 to-emerald-500/5'
        };
      case 'Good':
        return { 
          text: 'text-indigo-700', 
          bg: 'bg-indigo-50/80', 
          border: 'border-indigo-200/60',
          gradient: 'from-indigo-500/10 to-purple-500/5'
        };
      case 'Fair':
        return { 
          text: 'text-amber-700', 
          bg: 'bg-amber-50/80', 
          border: 'border-amber-200/60',
          gradient: 'from-amber-500/10 to-orange-500/5'
        };
      case 'Poor':
        return { 
          text: 'text-rose-700', 
          bg: 'bg-rose-50/80', 
          border: 'border-rose-200/60',
          gradient: 'from-rose-500/10 to-pink-500/5'
        };
      default:
        return { 
          text: 'text-slate-700', 
          bg: 'bg-slate-50/80', 
          border: 'border-slate-200/60',
          gradient: 'from-slate-500/10 to-slate-400/5'
        };
    }
  };

  const colors = getFidelityColor(metrics.fidelityRating);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* CARD 1: File Size Optimization */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110" />
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">File Size Optimization</span>
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50">
              <Percent className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 bg-clip-text text-transparent tracking-tight">
              {metrics.reductionPercent.toFixed(1)}%
            </span>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full border border-emerald-200/40 uppercase tracking-wider">
              Smaller
            </span>
          </div>

          <div className="mt-5 space-y-3 text-xs border-t border-slate-100 pt-4">
            <div className="flex justify-between items-center text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400" /> Original size</span>
              <span className="font-bold text-slate-700">{formatBytes(original.fileSize)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-indigo-500/80" /> Compressed size</span>
              <span className="font-extrabold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-lg border border-indigo-100/30">{formatBytes(compressed.fileSize)}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 bg-gradient-to-r from-slate-50 to-indigo-50/30 rounded-xl p-2.5 text-center border border-slate-100/50">
          <span className="text-xs text-slate-500 font-semibold">
            Compression Ratio:{' '}
            <strong className="text-indigo-600 font-black">
              {metrics.ratio > 1 ? `${metrics.ratio.toFixed(1)}x` : '1.0x'}
            </strong>
          </span>
        </div>
      </div>

      {/* CARD 2: Visual Fidelity Assessment */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${colors.gradient} rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110`} />

        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Visual Similarity</span>
            <span className={`p-1.5 ${colors.bg} ${colors.text} rounded-xl border ${colors.border}`}>
              <Activity className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 tracking-tight">
              {metrics.psnr === 99.9 ? '∞' : `${metrics.psnr} dB`}
            </span>
            <span className={`text-[10px] font-extrabold ${colors.text} ${colors.bg} px-2.5 py-0.5 rounded-full border ${colors.border} uppercase tracking-wider`}>
              {metrics.fidelityRating}
            </span>
          </div>

          <div className="mt-5 space-y-3.5 border-t border-slate-100 pt-4">
            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1.5">
                <span className="font-bold flex items-center gap-1.5">
                  <HeartCrack className="w-4 h-4 text-rose-500" /> Estimated Quality Loss
                </span>
                <span className="font-extrabold text-rose-600">{metrics.qualityLossScore}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden p-[1px] border border-slate-200/20">
                <div
                  className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${metrics.qualityLossScore}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-xs text-slate-400 font-semibold">
              <span>Mean Squared Error (MSE):</span>
              <span className="font-mono font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{metrics.mse}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold pt-1 border-t border-slate-50">
          <Info className="w-4 h-4 text-slate-300 shrink-0" />
          <span>PSNR measures exact per-pixel color discrepancy.</span>
        </div>
      </div>

      {/* CARD 3: Specifications & Format */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Specifications</span>
            <span className="p-1.5 bg-slate-100 text-slate-500 rounded-xl border border-slate-200/50">
              <Layers className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">Image Dimensions</span>
              <span className="text-xl font-extrabold text-slate-800 tracking-tight flex items-baseline gap-1.5">
                {original.width} × {original.height}
                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/30">
                  {(original.width * original.height / 1000000).toFixed(1)} MP
                </span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs font-semibold">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">Render Format</span>
                <span className="font-extrabold text-indigo-900 bg-indigo-50/50 px-2.5 py-1 rounded-lg border border-indigo-100/30 inline-block uppercase">
                  {compressed.format.split('/')[1]}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">Encode Speed</span>
                <span className="font-extrabold text-slate-700 flex items-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  {compressed.processingTimeMs} ms
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-3 text-[11px] text-indigo-950 font-bold flex gap-2 items-start border border-indigo-200/20 shadow-sm shadow-indigo-100/5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600 animate-pulse" />
          <span>Processes locally on your device. Zero cloud uploads guarantee 100% data privacy.</span>
        </div>
      </div>

    </div>
  );
}
