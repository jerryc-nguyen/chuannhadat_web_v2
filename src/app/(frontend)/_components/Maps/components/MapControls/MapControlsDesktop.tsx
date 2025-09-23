'use client';
import { Button } from '@components/ui/button';
import { Search, MapPin, Navigation, Home, Building2, Hotel, Camera, Landmark, Bus, Cross } from 'lucide-react';
import { useState } from 'react';
import { MapControlsProps } from '../../types';

const MapControlsDesktop: React.FC<MapControlsProps> = ({
  onSearch,
  onLocationClick,
  onLayersClick,
  onNavigationClick,
  onHomeClick,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const filterCategories = [
    { icon: Building2, label: 'Nhà đất', active: true },
    { icon: Hotel, label: 'Khách sạn', active: false },
    { icon: Camera, label: 'Điểm tham quan', active: false },
    { icon: Landmark, label: 'Bảo tàng', active: false },
    { icon: Bus, label: 'Giao thông', active: false },
    { icon: Cross, label: 'Dược phẩm', active: false },
  ];

  return (
    <>
      {/* Google Maps Style Search & Filter - Top Left */}
      <div className={`absolute top-4 left-4 z-[1000] ${className}`}>
        {/* Search Bar */}
        <div className="mb-3">
          <form onSubmit={handleSearchSubmit}>
            <div className="flex items-center bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 w-80">
              <div className="p-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm trên Google Maps"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-2 py-3 text-base border-none outline-none bg-transparent text-gray-700 placeholder-gray-500"
              />
            </div>
          </form>
        </div>

        {/* Filter Categories */}
        <div className="flex gap-2 flex-wrap max-w-80">
          {filterCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={index}
                variant={category.active ? "default" : "outline"}
                size="sm"
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${category.active
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm'
                  }
                `}
                onClick={() => console.log(`Filter: ${category.label}`)}
              >
                <IconComponent className="h-4 w-4" />
                <span>{category.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Control Buttons - Right Side */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-3">
        {/* Home Button */}
        <Button
          variant="outline"
          size="lg"
          className="bg-white shadow-md hover:shadow-lg hover:bg-gray-50 p-3 rounded-lg border border-gray-200 transition-all duration-200"
          onClick={onHomeClick}
          title="Về trang chủ"
        >
          <Home className="h-5 w-5 text-gray-600" />
        </Button>

        {/* My Location Button */}
        <Button
          variant="outline"
          size="lg"
          className="bg-white shadow-md hover:shadow-lg hover:bg-gray-50 p-3 rounded-lg border border-gray-200 transition-all duration-200"
          onClick={onLocationClick}
          title="Vị trí của tôi"
        >
          <MapPin className="h-5 w-5 text-gray-600" />
        </Button>

        {/* Navigation Button */}
        <Button
          variant="outline"
          size="lg"
          className="bg-white shadow-md hover:shadow-lg hover:bg-gray-50 p-3 rounded-lg border border-gray-200 transition-all duration-200"
          onClick={onNavigationClick}
          title="Chỉ đường"
        >
          <Navigation className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
    </>
  );
};

export default MapControlsDesktop;
