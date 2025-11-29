'use client';
import { MapPin, Download } from 'lucide-react';
import { Button } from '@components/ui/button';

interface FallbackMapProps {
  className?: string;
}

const FallbackMap: React.FC<FallbackMapProps> = ({ className = 'h-full w-full' }) => {
  return (
    <div className={`${className} bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center`}>
      <div className="text-center max-w-md p-8">
        <div className="mb-6">
          <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bản đồ đang được tải</h2>
          <p className="text-gray-600 mb-4">
            Để xem bản đồ tương tác, vui lòng cài đặt thư viện Leaflet
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg border">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Cài đặt thư viện
          </h3>
          <div className="bg-gray-100 rounded p-3 mb-4">
            <code className="text-sm font-mono text-gray-800">
              npm install leaflet @types/leaflet
            </code>
          </div>
          <p className="text-xs text-gray-500">
            Sau khi cài đặt, reload trang để xem bản đồ
          </p>
        </div>

        <div className="mt-6">
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Reload trang
          </Button>
        </div>

        {/* Mock map preview */}
        <div className="mt-8 bg-white rounded-lg p-4 shadow border">
          <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Xem trước bản đồ</p>
              <p className="text-xs text-gray-400">TP. Hồ Chí Minh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallbackMap;
