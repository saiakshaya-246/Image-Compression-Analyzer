import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize, Move, HelpCircle, Columns, SlidersHorizontal, Info } from 'lucide-react';
import { ImageDetails, CompressedDetails } from '../types';

interface ComparisonViewerProps {
  original: ImageDetails;
  compressed: CompressedDetails;
}

export default function ComparisonViewer({ original, compressed }: ComparisonViewerProps) {
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side'>('split');
  const [zoom, setZoom] = useState<number>(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [sliderPercent, setSliderPercent] = useState<number>(50);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [isSliderDragging, setIsSliderDragging] = useState(false);

  // Sync zoom limits
  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.5, 12));
  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = prev / 1.5;
      if (next <= 1.05) {
        setPanOffset({ x: 0, y: 0 });
        return 1;
      }
      return next;
    });
  };
  const handleZoomReset = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom === 1) return; // Only pan when zoomed in
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    // Set pan limit based on zoom level to keep image visible
    const limitX = (zoom - 1) * 200;
    const limitY = (zoom - 1) * 150;
    
    setPanOffset({
      x: Math.max(-limitX, Math.min(limitX, dx)),
      y: Math.max(-limitY, Math.min(limitY, dy)),
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch Pan handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom === 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStart.current.x;
    const dy = touch.clientY - dragStart.current.y;
    const limitX = (zoom - 1) * 200;
    const limitY = (zoom - 1) * 150;
    
    setPanOffset({
      x: Math.max(-limitX, Math.min(limitX, dx)),
      y: Math.max(-limitY, Math.min(limitY, dy)),
    });
  };

  // Split-slider drag handlers
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPercent(percent);
  };

  const onSliderMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSliderDragging(true);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isSliderDragging) {
        handleSliderMove(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsSliderDragging(false);
    };

    if (isSliderDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isSliderDragging]);

  // Touch handlers for slider
  const onSliderTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  // Image wrapper styles
  const transformStyle = {
    transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
    transition: isDragging ? 'none' : 'transform 0.15s ease-out',
    cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm mb-8">
      {/* Viewer Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start border border-slate-200/40">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl transition-all duration-200 ${
              viewMode === 'split'
                ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100/50'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Split Slider
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl transition-all duration-200 ${
              viewMode === 'side-by-side'
                ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100/50'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Side-by-Side
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <span className="text-xs font-black text-slate-500 bg-slate-100/60 px-3 py-1.5 rounded-xl border border-slate-200/20 flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-indigo-500" /> Scale: {Math.round(zoom * 100)}%
          </span>
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-sm">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              title="Zoom Out"
              className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomReset}
              disabled={zoom === 1}
              title="Reset Zoom"
              className="p-2.5 text-xs font-black text-slate-600 hover:text-indigo-600 hover:bg-white border-x border-slate-200 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              100%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 12}
              title="Zoom In"
              className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas / Image Comparison Display */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-slate-900 aspect-[4/3] max-h-[600px] flex items-center justify-center">
        
        {viewMode === 'split' ? (
          <div
            ref={sliderContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
            className="relative w-full h-full select-none overflow-hidden flex items-center justify-center"
          >
            {/* Background: Original Image */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={original.url}
                alt="Original"
                className="max-w-full max-h-full object-contain pointer-events-none select-none"
                style={transformStyle}
              />
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-sm text-[10px] font-bold text-white px-2.5 py-1 rounded-md border border-white/15 uppercase tracking-wider shadow-sm z-10 pointer-events-none">
                Original ({original.format.split('/')[1] || 'Source'})
              </div>
            </div>

            {/* Foreground Overlay: Compressed Image, clipped by split slider */}
            <div
              className="absolute inset-0 flex items-center justify-center p-4 overflow-hidden pointer-events-none"
              style={{
                clipPath: `polygon(0 0, ${sliderPercent}% 0, ${sliderPercent}% 100%, 0 100%)`
              }}
            >
              <img
                src={compressed.url}
                alt="Compressed"
                className="max-w-full max-h-full object-contain pointer-events-none select-none"
                style={transformStyle}
              />
              <div className="absolute top-4 right-4 bg-indigo-950/80 backdrop-blur-sm text-[10px] font-bold text-indigo-300 px-2.5 py-1 rounded-md border border-indigo-500/20 uppercase tracking-wider shadow-sm z-10 pointer-events-none">
                Optimized (Q: {compressed.quality}%)
              </div>
            </div>

            {/* Interactive Slider Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 cursor-ew-resize bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)] z-20"
              style={{ left: `${sliderPercent}%` }}
              onMouseDown={onSliderMouseDown}
              onTouchMove={onSliderTouchMove}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-indigo-500 shadow-md flex items-center justify-center hover:bg-indigo-50 transition-colors select-none">
                <div className="flex gap-0.5 items-center justify-center text-indigo-500 pointer-events-none">
                  <span className="text-xs font-black">‹</span>
                  <span className="text-xs font-black">›</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Side by Side Mode */
          <div className="grid grid-cols-2 w-full h-full divide-x divide-slate-800">
            {/* Original Panel */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUpOrLeave}
              className="relative w-full h-full overflow-hidden select-none flex items-center justify-center p-4"
            >
              <img
                src={original.url}
                alt="Original Side"
                className="max-w-full max-h-full object-contain pointer-events-none select-none"
                style={transformStyle}
              />
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-sm text-[10px] font-bold text-white px-2.5 py-1 rounded-md border border-white/15 uppercase tracking-wider shadow-sm z-10">
                Original ({original.format.split('/')[1] || 'Source'})
              </div>
            </div>

            {/* Compressed Panel */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUpOrLeave}
              className="relative w-full h-full overflow-hidden select-none flex items-center justify-center p-4"
            >
              <img
                src={compressed.url}
                alt="Compressed Side"
                className="max-w-full max-h-full object-contain pointer-events-none select-none"
                style={transformStyle}
              />
              <div className="absolute top-4 left-4 bg-indigo-950/80 backdrop-blur-sm text-[10px] font-bold text-indigo-300 px-2.5 py-1 rounded-md border border-indigo-500/20 uppercase tracking-wider shadow-sm z-10">
                Optimized (Q: {compressed.quality}%)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Guidance / Microcopy */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-slate-400 font-semibold px-1">
        {zoom > 1 ? (
          <span className="flex items-center gap-1 text-indigo-500">
            <Info className="w-4 h-4 shrink-0 text-indigo-400" />
            Panning is active. Click/touch and drag to inspect different areas.
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Info className="w-4 h-4 shrink-0 text-slate-300" />
            Scale up (e.g. 200%) to inspect pixel level artifact differences.
          </span>
        )}

        {viewMode === 'split' && (
          <span className="text-slate-400">
            Drag the divider handle left or right to swipe compare original vs optimized.
          </span>
        )}
      </div>
    </div>
  );
}
