'use client';
import { Button } from '@components/ui/button';
import { Search, MapPin, Layers, Navigation, Home } from 'lucide-react';
import { useState } from 'react';
import { MapControlsProps } from '../types';

const MapControls: React.FC<MapControlsProps> = ({
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
    <div className={`absolute top-4 left-4 z-[1000] ${className}`}>
      {/* Search Bar */}
      <div className="mb-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <div className={`flex items-center bg-white rounded-lg shadow-lg border transition-all duration-300 ${isSearchExpanded ? 'w-80' : 'w-12'
            }`}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-3 hover:bg-gray-100"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            >
              <Search className="h-4 w-4" />
            </Button>
            {isSearchExpanded && (
              <input
                type="text"
                placeholder="Tìm kiếm địa điểm, dự án..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border-none outline-none bg-transparent"
                autoFocus
              />
            )}
          </div>
        </form>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col gap-2">
        {/* Home Button */}
        <Button
          variant="outline"
          size="sm"
          className="bg-white shadow-lg hover:bg-gray-50 p-3"
          onClick={onHomeClick}
          title="Về trang chủ"
        >
          <Home className="h-4 w-4" />
        </Button>

        {/* My Location Button */}
        <Button
          variant="outline"
          size="sm"
          className="bg-white shadow-lg hover:bg-gray-50 p-3"
          onClick={onLocationClick}
          title="Vị trí của tôi"
        >
          <MapPin className="h-4 w-4" />
        </Button>

        {/* Layers Button */}
        <Button
          variant="outline"
          size="sm"
          className="bg-white shadow-lg hover:bg-gray-50 p-3"
          onClick={onLayersClick}
          title="Lớp bản đồ"
        >
          <Layers className="h-4 w-4" />
        </Button>

        {/* Navigation Button */}
        <Button
          variant="outline"
          size="sm"
          className="bg-white shadow-lg hover:bg-gray-50 p-3"
          onClick={onNavigationClick}
          title="Chỉ đường"
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MapControls;
