'use client';
import { Button } from '@components/ui/button';
import { Briefcase, Banknote, ChevronDown, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { useClickOutside } from '@common/hooks/useClickOutside';
import { businessTypesOptions, categoryTypesOptions } from '@app/(frontend)/_components/features/search/filters-v2/constants';
import { Z_INDEX } from '../../constants';

interface FilterOptionsProps {
  onFilterChange?: (filters: {
    businessType?: string;
    categoryType?: string;
  }) => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({ onFilterChange }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    businessType: null as string | null,
    categoryType: null as string | null,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const clearFilter = (filterType: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dropdown toggle

    const newFilters = {
      ...selectedFilters,
      [filterType]: null
    };

    setSelectedFilters(newFilters);

    // Notify parent of filter change
    onFilterChange?.({
      businessType: newFilters.businessType || undefined,
      categoryType: newFilters.categoryType || undefined,
    });
  };

  const clearAllFilters = () => {
    const newFilters = {
      businessType: null as string | null,
      categoryType: null as string | null,
    };

    setSelectedFilters(newFilters);
    setOpenDropdown(null);

    // Notify parent of filter change
    onFilterChange?.({
      businessType: undefined,
      categoryType: undefined,
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

  // Check if any filters are active
  const hasActiveFilters = selectedFilters.businessType !== null || selectedFilters.categoryType !== null;

  return (
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
              {category.active ? (
                <X
                  className="h-5 w-5 ml-1 hover:bg-blue-800 rounded-full p-0.5 transition-colors duration-200"
                  onClick={(e) => clearFilter(category.type, e)}
                />
              ) : (
                <ChevronDown className={`h-3 w-3 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              )}
            </Button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className={`absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[${Z_INDEX.DESKTOP_DROPDOWN}] min-w-[200px] max-h-[300px] overflow-y-auto`}>
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

      {/* Clear All Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
          onClick={clearAllFilters}
        >
          <X className="h-3 w-3" />
          <span>Xóa tất cả</span>
        </Button>
      )}
    </div>
  );
};

export default FilterOptions;
