'use client';
import { Button } from '@components/ui/button';
import { Search, MapPin, Navigation, Home, Menu } from 'lucide-react';
import { useState } from 'react';
import { MapControlsProps } from '../types';

const MapControlsMobile: React.FC<MapControlsProps> = ({
  onSearch,
  onLocationClick,
  onLayersClick,
  onNavigationClick,
  onHomeClick,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <>
      {/* Mobile Header - Full Width Top */}
      <div className={`absolute top-0 left-0 right-0 bg-white shadow-lg z-[1000] p-4 ${className}`}>
        <div className="flex items-center gap-3">
          {/* Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            className="p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Tìm kiếm địa điểm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="mt-4 bg-white border-t pt-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onHomeClick}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Trang chủ
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLocationClick}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Vị trí của tôi
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Floating Buttons - Bottom Right */}
      <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-3">
        {/* My Location Button */}
        <Button
          variant="outline"
          size="lg"
          className="bg-white shadow-lg hover:bg-gray-50 p-4 rounded-full"
          onClick={onLocationClick}
          title="Vị trí của tôi"
        >
          <MapPin className="h-6 w-6" />
        </Button>

        {/* Navigation Button */}
        <Button
          variant="outline"
          size="lg"
          className="bg-white shadow-lg hover:bg-gray-50 p-4 rounded-full"
          onClick={onNavigationClick}
          title="Chỉ đường"
        >
          <Navigation className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
};

export default MapControlsMobile;
