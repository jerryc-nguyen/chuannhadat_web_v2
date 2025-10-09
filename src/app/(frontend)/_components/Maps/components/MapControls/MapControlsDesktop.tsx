'use client';
import { Button } from '@components/ui/button';
import { MapPin, Navigation, Home, Briefcase, Banknote, ChevronDown } from 'lucide-react';
import { MapControlsProps } from '../../types';
import Autocomplete from './Autocomplete';
import { OptionForSelect } from '@common/types';
import { useSetAtom } from 'jotai';
import { markerClickAtom } from '../../states/mapAtoms';
import { IUser, CustomerGender } from '@common/types';
import { TMapSetting } from '../../types';
import { businessTypesOptions, categoryTypesOptions } from '@frontend/features/search/filter-conditions/constants';
import { useState, useRef } from 'react';
import { useClickOutside } from '@common/hooks/useClickOutside';


const MapControlsDesktop: React.FC<MapControlsProps> = ({
  onSearch,
  onLocationClick,
  onLayersClick: _onLayersClick,
  onNavigationClick,
  onHomeClick,
  onFilterChange,
  className = '',
  searchQuery = '',
  onSearchQueryChange,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    businessType: null as string | null,
    categoryType: null as string | null,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMarkerClick = useSetAtom(markerClickAtom);

  const handleAutocompleteSelect = (option: OptionForSelect) => {
    // Create a marker object from the autocomplete option
    if (option.data && option.data_type === 'MapSetting') {
      const markerData = option.data as unknown as TMapSetting;

      // Create a minimal user object for autocomplete results
      const minimalUser: IUser = {
        id: markerData.mappable_id,
        full_name: markerData.location_name,
        address: markerData.formatted_address,
        avatar_url: '',
        description: null,
        job_title: null,
        phone: '',
        posts_count: 0,
        profile_tags: [],
        // Fill in other required fields with defaults
        api_token: '',
        formatted_badges: null,
        formatted_joined_at: '',
        gender: CustomerGender.Male,
        referral_code: '',
        post_token: '',
        slug: markerData.uid,
      };

      const marker = {
        id: markerData.id,
        uid: markerData.uid,
        mappable_ype: markerData.mappable_type,
        mappable_id: markerData.mappable_id,
        mappable_data: minimalUser,
        location: markerData.location,
        location_name: markerData.location_name,
        marker_label: markerData.location_name,
      };

      // Trigger marker selection
      handleMarkerClick(marker);
    }
  };

  const handleSearchSubmit = (queryOrEvent: string | React.FormEvent) => {
    if (typeof queryOrEvent === 'string') {
      // Direct query string from Autocomplete
      if (onSearch && queryOrEvent.trim()) {
        onSearch(queryOrEvent.trim());
      }
    } else {
      // Form event (legacy support)
      queryOrEvent.preventDefault();
      if (onSearch && searchQuery.trim()) {
        onSearch(searchQuery.trim());
      }
    }
  };

  const handleFilterSelect = (filterType: string, value: string) => {
    const newFilters = {
      ...selectedFilters,
      [filterType]: value
    };

    setSelectedFilters(newFilters);
    setOpenDropdown(null);

    // Notify parent of filter change
    onFilterChange?.({
      businessType: newFilters.businessType || undefined,
      categoryType: newFilters.categoryType || undefined,
    });
  };

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, () => setOpenDropdown(null), !!openDropdown);

  const filterCategories = [
    {
      icon: Briefcase,
      label: 'Hình thức',
      type: 'businessType',
      options: businessTypesOptions,
      active: selectedFilters.businessType !== null,
      selectedValue: selectedFilters.businessType
    },
    {
      icon: Banknote,
      label: 'Loại nhà đất',
      type: 'categoryType',
      options: categoryTypesOptions,
      active: selectedFilters.categoryType !== null,
      selectedValue: selectedFilters.categoryType
    }
  ];

  return (
    <>
      {/* Google Maps Style Search & Filter - Fixed Top */}
      <div className={`fixed top-0 left-0 right-0 z-[1000] p-4 ${className}`}>
        <div className="flex gap-3 items-center">
          {/* Search Bar */}
          <Autocomplete
            value={searchQuery}
            onChange={onSearchQueryChange}
            onSelect={handleAutocompleteSelect}
            onSubmit={handleSearchSubmit}
            placeholder="Tìm kiếm trên Google Maps"
          />

          {/* Filter Categories */}
          <div ref={dropdownRef} className="flex gap-2 flex-wrap ml-4 relative">
            {filterCategories.map((category, index) => {
              const IconComponent = category.icon;
              const isOpen = openDropdown === category.type;

              return (
                <div key={index} className="relative">
                  <Button
                    variant={category.active ? "default" : "outline"}
                    size="sm"
                    className={`
                    flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${category.active
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm'
                      }
                  `}
                    onClick={() => toggleDropdown(category.type)}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{category.selectedValue ?
                      category.options.find(opt => opt.value === category.selectedValue)?.text || category.label
                      : category.label
                    }</span>
                    <ChevronDown className={`h-3 w-3 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[1001] min-w-[200px] max-h-[300px] overflow-y-auto">
                      <div className="py-1">
                        {category.options.map((option) => (
                          <button
                            key={option.value}
                            className={`
                            w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors duration-200
                            ${category.selectedValue === option.value
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-700'
                              }
                          `}
                            onClick={() => handleFilterSelect(category.type, String(option.value))}
                          >
                            {option.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
