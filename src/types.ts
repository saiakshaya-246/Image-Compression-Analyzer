export type OutputFormat = 'image/jpeg' | 'image/webp';

export interface ImageDetails {
  name: string;
  url: string; // Object URL or data URL
  fileSize: number; // in bytes
  width: number;
  height: number;
  format: string; // original mime type or file extension
}

export interface CompressedDetails {
  url: string; // data URL or Object URL
  fileSize: number; // in bytes
  width: number;
  height: number;
  format: OutputFormat;
  quality: number; // 0 to 100
  processingTimeMs: number;
}

export interface ComparisonMetrics {
  originalSize: number;
  compressedSize: number;
  ratio: number; // e.g. originalSize / compressedSize
  reductionPercent: number; // e.g. ((originalSize - compressedSize) / originalSize) * 100
  psnr: number; // Peak Signal-to-Noise Ratio in dB
  mse: number; // Mean Squared Error
  qualityLossScore: number; // 0 to 100 representation of quality loss
  fidelityRating: 'Perfect' | 'Excellent' | 'Good' | 'Fair' | 'Poor';
}
