import { useState, useEffect } from 'react';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import MetricsPanel from './components/MetricsPanel';
import ComparisonViewer from './components/ComparisonViewer';
import ControlSlider from './components/ControlSlider';
import { ImageDetails, CompressedDetails, ComparisonMetrics, OutputFormat } from './types';
import { compressImage, calculatePSNRAndMSE } from './utils/image';
import { Sparkles, Sliders, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [originalImage, setOriginalImage] = useState<ImageDetails | null>(null);
  const [compressedImage, setCompressedImage] = useState<CompressedDetails | null>(null);
  const [metrics, setMetrics] = useState<ComparisonMetrics | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<OutputFormat>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Manage files selection
  const handleImageSelected = (file: File | null) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setOriginalImage({
        name: file.name,
        url,
        fileSize: file.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: file.type,
      });
    };
    img.src = url;
  };

  // Perform local compression and metrics calculation on slider change
  useEffect(() => {
    if (!originalImage) {
      setCompressedImage(null);
      setMetrics(null);
      return;
    }

    let active = true;
    setIsProcessing(true);

    compressImage(originalImage.url, quality, format)
      .then((result) => {
        if (!active) {
          // Cleanup unused URL immediately to prevent leaks
          URL.revokeObjectURL(result.url);
          return;
        }

        const compressedDetails: CompressedDetails = {
          url: result.url,
          fileSize: result.size,
          width: result.width,
          height: result.height,
          format: format,
          quality: quality,
          processingTimeMs: result.processingTimeMs,
        };

        setCompressedImage((prev) => {
          if (prev?.url && prev.url.startsWith('blob:')) {
            URL.revokeObjectURL(prev.url);
          }
          return compressedDetails;
        });

        return calculatePSNRAndMSE(originalImage.url, result.url).then((similarity) => {
          if (!active) return;

          const originalSize = originalImage.fileSize;
          const compressedSize = result.size;
          const ratio = originalSize / compressedSize;
          const reductionPercent = ((originalSize - compressedSize) / originalSize) * 100;

          setMetrics({
            originalSize,
            compressedSize,
            ratio: isNaN(ratio) ? 1 : ratio,
            reductionPercent: isNaN(reductionPercent) ? 0 : reductionPercent,
            psnr: similarity.psnr,
            mse: similarity.mse,
            qualityLossScore: similarity.qualityLossScore,
            fidelityRating: similarity.fidelityRating,
          });
          setIsProcessing(false);
        });
      })
      .catch((err) => {
        console.error('Compression failed:', err);
        if (active) setIsProcessing(false);
      });

    return () => {
      active = false;
    };
  }, [originalImage, quality, format]);

  // Clean up initial original object URL on unmount
  useEffect(() => {
    return () => {
      if (originalImage?.url && originalImage.url.startsWith('blob:')) {
        URL.revokeObjectURL(originalImage.url);
      }
    };
  }, [originalImage]);

  // Clean up compressed object URL on unmount
  useEffect(() => {
    return () => {
      if (compressedImage?.url && compressedImage.url.startsWith('blob:')) {
        URL.revokeObjectURL(compressedImage.url);
      }
    };
  }, [compressedImage]);

  const handleDownload = () => {
    if (!compressedImage || !originalImage) return;

    const extension = format === 'image/jpeg' ? 'jpg' : 'webp';
    const lastDotIndex = originalImage.name.lastIndexOf('.');
    const baseName = lastDotIndex !== -1 ? originalImage.name.substring(0, lastDotIndex) : originalImage.name;
    const fileName = `${baseName}_optimized_q${quality}.${extension}`;

    const link = document.createElement('a');
    link.href = compressedImage.url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setCompressedImage(null);
    setMetrics(null);
    setQuality(80);
    setFormat('image/jpeg');
  };

  const extension = format === 'image/jpeg' ? 'jpg' : 'webp';
  const lastDotIndex = originalImage ? originalImage.name.lastIndexOf('.') : -1;
  const baseName = originalImage
    ? lastDotIndex !== -1
      ? originalImage.name.substring(0, lastDotIndex)
      : originalImage.name
    : '';
  const downloadFilename = `${baseName}_optimized_q${quality}.${extension}`;

  return (
    <div className="min-h-screen ambient-bg flex flex-col font-sans selection:bg-indigo-500/10 selection:text-indigo-900">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!originalImage ? (
          <Dropzone onImageSelected={handleImageSelected} />
        ) : (
          <div className="space-y-6">
            
            {/* Active view status banner with subtle loader */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-100">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 break-all leading-snug">
                    {originalImage.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">
                    Original Resolution: {originalImage.width} × {originalImage.height}px
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {isProcessing && (
                  <span className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 px-3.5 py-2 rounded-xl border border-indigo-200/50 shadow-sm animate-pulse">
                    <span className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    Calculating Metrics...
                  </span>
                )}
                {!isProcessing && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200/40 flex items-center gap-1.5 shadow-sm">
                    ✓ Optimized and Synchronized
                  </span>
                )}
              </div>
            </div>

            {/* Side by side / Split compare area */}
            {compressedImage && (
              <ComparisonViewer
                original={originalImage}
                compressed={compressedImage}
              />
            )}

            {/* Bento Grid Metrics metrics */}
            <MetricsPanel
              original={originalImage}
              compressed={compressedImage || {
                url: '',
                fileSize: 0,
                width: originalImage.width,
                height: originalImage.height,
                format: format,
                quality: quality,
                processingTimeMs: 0,
              }}
              metrics={metrics}
            />

            {/* Quality control slider & Download tools */}
            <ControlSlider
              quality={quality}
              onQualityChange={setQuality}
              format={format}
              onFormatChange={setFormat}
              onDownload={handleDownload}
              onReset={handleReset}
              downloadFilename={downloadFilename}
            />

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <span>Image Compression Comparator &copy; 2026. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Powered by high-performance canvas codecs.
          </span>
        </div>
      </footer>
    </div>
  );
}
