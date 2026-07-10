import { Image, Sliders, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-100/80 bg-white/70 backdrop-blur-xl sticky top-0 z-50 shadow-[0_1px_10px_-4px_rgba(99,102,241,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-md shadow-indigo-200">
            <Image className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-2">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Image Compression Comparator
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider shadow-sm">
                <Sparkles className="w-2.5 h-2.5 text-emerald-500 animate-pulse" /> Local Engine
              </span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
              Analyze multi-format metrics, compare visual loss, and optimize image foot-print instantly
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100/60 rounded-lg">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Interactive Controls</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50/50 text-emerald-700 rounded-lg border border-emerald-100/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>100% Private (No Servers)</span>
          </div>
        </div>
      </div>
    </header>
  );
}
