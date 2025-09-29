import React from 'react';
import {
  BANK_ACCOUNT_NAME,
  BANK_ACCOUNT_NUMBER_QR,
  BANK_CODE,
} from '@common/constants';
import { RefreshCw } from 'lucide-react';

interface QRImageProps {
  selectedAmount: number | null;
  bankTransferNote: string;
  className?: string;
  height?: number;
}

export const QRImage: React.FC<QRImageProps> = ({
  selectedAmount,
  bankTransferNote,
  className = '',
  height
}) => {
  const [rebuildKey, setRebuildKey] = React.useState(0);
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);

  const vietQrUrl = `https://img.vietqr.io/image/${BANK_CODE}-${BANK_ACCOUNT_NUMBER_QR}-compact2.png?amount=${selectedAmount}&addInfo=${bankTransferNote}&accountName=${BANK_ACCOUNT_NAME}&t=${rebuildKey}`;

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
    // Auto-retry after a short delay
    setTimeout(() => {
      setRebuildKey(prev => prev + 1);
      setImageError(false);
      setIsImageLoading(true);
    }, 2000);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleManualRebuild = () => {
    setRebuildKey(prev => prev + 1);
    setImageError(false);
    setIsImageLoading(true);
  };

  // Reset image state when amount changes
  React.useEffect(() => {
    setIsImageLoading(true);
    setImageError(false);
    setRebuildKey(prev => prev + 1);
  }, [selectedAmount, bankTransferNote]);

  return (
    <div
      className={`relative rounded-lg border shadow-md bg-white ${className}`}
      style={height ? { height: `${height}px` } : undefined}
    >
      {isImageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-sm text-gray-600">Đang tải QR...</p>
          </div>
        </div>
      )}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-red-600">Không tải được QR</p>
            <button
              onClick={handleManualRebuild}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Thử lại
            </button>
          </div>
        </div>
      )}
      <img
        alt={BANK_ACCOUNT_NAME}
        src={vietQrUrl}
        width="300"
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`${height ? 'w-full h-full object-contain' : 'w-full h-auto'} ${isImageLoading || imageError ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};
