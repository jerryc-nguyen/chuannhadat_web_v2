'use client';

import React, { useState } from 'react';
import { Clock, MapPin, X, UserCircle } from 'lucide-react';
import { OptionForSelect } from '@common/types';
import { SearchResultType } from '../hooks/useAutocompleteSearch';
import { useApp } from '@common/context/AppContext';

interface AutocompleteDropdownProps {
  options: OptionForSelect[];
  selectedIndex: number;
  resultType: SearchResultType;
  onSelect: (option: OptionForSelect) => void;
  onDelete?: (option: OptionForSelect) => void;
  onClose?: () => void;
  className?: string;
  getIconType?: (option: OptionForSelect, index: number) => 'recent' | 'search';
}

const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  options,
  selectedIndex,
  resultType,
  onSelect,
  onDelete,
  onClose,
  className = '',
  getIconType,
}) => {
  const { isMobile } = useApp();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (options.length === 0) {
    return null;
  }

  const handleDelete = (e: React.MouseEvent, option: OptionForSelect) => {
    e.stopPropagation(); // Prevent triggering the select action
    onDelete?.(option);
  };

  return (
    <div
      className={`${isMobile ? 'max-h-[60vh]' : 'max-h-64'} absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-y-auto z-50 ${className}`}
      style={isMobile ? {
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none', /* IE and Edge */
      } : undefined}
    >
      {isMobile && (
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
          }
        `}</style>
      )}
      {isMobile && onClose && (
        <div className="flex justify-between items-center px-4 py-2.5 border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white sticky top-0 z-10">
          <div className="flex items-center">
            <span className="text-gray-500">
              {options.length} {'kết quả phù hợp'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Close dropdown"
          >
            <X className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      )}
      {options.map((option, index) => {
        const isRecent = (getIconType ? getIconType(option, index) : resultType) === 'recent';
        const isHovered = hoveredIndex === index;

        return (
          <div
            key={String(option.value || index)}
            className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${index === selectedIndex ? 'bg-blue-50 border-blue-200' : ''
              }`}
            onClick={() => onSelect(option)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center gap-2">
              {/* Icon based on result type and data_type */}
              <div className="flex-shrink-0">
                {isRecent ? (
                  <Clock className="h-4 w-4 text-gray-400" />
                ) : option.data_type === 'MapSetting' ? (
                  <MapPin className="h-4 w-4 text-gray-400" />
                ) : option.data_type === 'User' ? (
                  <UserCircle className="h-4 w-4 text-gray-400" />
                ) : (
                  <MapPin className="h-4 w-4 text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {option.description && (
                  <div className="text-xs text-gray-500 truncate mb-0.5">
                    {option.description}
                  </div>
                )}
                <div className="font-medium text-gray-900 truncate">
                  {option.text}
                </div>
              </div>

              {/* Delete icon for recent items - always present but hidden when not hovered */}
              {isRecent && onDelete && (
                <div className="flex-shrink-0 w-7 flex justify-center">
                  <button
                    onClick={(e) => handleDelete(e, option)}
                    className={`rounded-full transition-all duration-150 ${isHovered || isMobile
                      ? 'opacity-100'
                      : 'opacity-0'
                      }`}
                    title="Remove from recent searches"
                  >
                    <X className="h-4 w-4 text-gray-500 hover:text-red-600" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AutocompleteDropdown;
