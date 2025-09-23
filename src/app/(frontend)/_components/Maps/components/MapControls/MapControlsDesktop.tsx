'use client';
import { Button } from '@components/ui/button';
import { Search, MapPin, Navigation, Home, Building2, Briefcase, Banknote } from 'lucide-react';
import { MapControlsProps } from '../../types';
import { SEARCH_BOX_WIDTH } from '../../constants';


const MapControlsDesktop: React.FC<MapControlsProps> = ({
  onSearch,
  onLocationClick,
  onLayersClick: _onLayersClick,
  onNavigationClick,
  onHomeClick,
  className = '',
  searchQuery = '',
  onSearchQueryChange,
}) => {

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const filterCategories = [
    { icon: Briefcase, label: 'Môi giới', active: true },
    { icon: Building2, label: 'Công ty BĐS', active: false },
    { icon: Banknote, label: 'Ngân hàng', active: false }
  ];

  return (
    <>
      {/* Google Maps Style Search & Filter - Fixed Top */}
      <div className={`fixed top-0 left-0 right-0 z-[1000] p-4 ${className}`}>
        <div className="flex gap-3 items-center">
          {/* Search Bar */}
          <div>
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg hover:border-gray-300 focus-within:shadow-lg focus-within:border-blue-300 transition-all duration-200" style={{ width: SEARCH_BOX_WIDTH }}>
                <div className="pl-4 pr-2">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm trên Google Maps"
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange?.(e.target.value)}
                  className="flex-1 px-1 py-3 text-base border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 focus:text-gray-900 focus:placeholder-gray-500 transition-colors duration-200"
                />
              </div>
            </form>
          </div>

          {/* Filter Categories */}
          <div className="flex gap-2 flex-wrap ml-4">
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
      </div>

      {/* Control Buttons - Right Side */}
      <div className="fixed top-20 right-4 z-[1000] flex flex-col gap-3">
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
