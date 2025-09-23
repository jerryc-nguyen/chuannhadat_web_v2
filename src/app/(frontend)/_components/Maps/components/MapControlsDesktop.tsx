'use client';
import { Button } from '@components/ui/button';
import { Search, MapPin, Layers, Navigation, Home } from 'lucide-react';
import { useState } from 'react';
import { MapControlsProps } from '../types';

const MapControlsDesktop: React.FC<MapControlsProps> = ({
  onSearch,
  onLocationClick,
  onLayersClick,
  onNavigationClick,
  onHomeClick,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <>
      {/* Desktop Search Bar - Top Center */}
      <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] ${className}`}>
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <div className={`flex items-center bg-white rounded-full shadow-lg border transition-all duration-300 ${
            isSearchExpanded ? 'w-96' : 'w-14'
          }`}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-4 hover:bg-gray-100 rounded-full"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            >
              <Search className="h-5 w-5" />
            </Button>
            {isSearchExpanded && (
              <input
                type="text"
                placeholder="Tìm kiếm địa điểm, dự án, khu vực..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 text-base border-none outline-none bg-transparent rounded-r-full"
                autoFocus
              />
            )}
          </div>
        </form>
      </div>

      {/* Desktop Control Buttons - Right Side */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-3">
        {/* Home Button */}
        <Button
          variant="outline"
          size="lg"
          className="bg-white shadow-lg hover:bg-gray-50 p-4 rounded-full"
          onClick={onHomeClick}
          title="Về trang chủ"
        >
          <Home className="h-5 w-5" />
        </Button>

        {/* My Location Button */}
        <Button
          variant="outline"
          size="lg"
          className="bg-white shadow-lg hover:bg-gray-50 p-4 rounded-full"
          onClick={onLocationClick}
          title="Vị trí của tôi"
        >
          <MapPin className="h-5 w-5" />
        </Button>

        {/* Layers Button */}
        <Button
          variant="outline"
          size="lg"
          className="bg-white shadow-lg hover:bg-gray-50 p-4 rounded-full"
          onClick={onLayersClick}
          title="Lớp bản đồ"
        >
          <Layers className="h-5 w-5" />
        </Button>

        {/* Navigation Button */}
        <Button
          variant="outline"
          size="lg"
          className="bg-white shadow-lg hover:bg-gray-50 p-4 rounded-full"
          onClick={onNavigationClick}
          title="Chỉ đường"
        >
          <Navigation className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
};

export default MapControlsDesktop;
