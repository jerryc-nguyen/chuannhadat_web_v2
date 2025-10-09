'use client';

import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { OptionForSelect } from '@common/types';
import { SearchResultType } from '../hooks/useAutocompleteSearch';

interface AutocompleteDropdownProps {
  options: OptionForSelect[];
  selectedIndex: number;
  resultType: SearchResultType;
  onSelect: (option: OptionForSelect) => void;
  className?: string;
}

const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  options,
  selectedIndex,
  resultType,
  onSelect,
  className = '',
}) => {
  if (options.length === 0) {
    return null;
  }

  return (
    <div className={`absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-50 ${className}`}>
      {options.map((option, index) => (
        <div
          key={String(option.value || index)}
          className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${index === selectedIndex ? 'bg-blue-50 border-blue-200' : ''
            }`}
          onClick={() => onSelect(option)}
        >
          <div className="flex items-center gap-2">
            {/* Icon based on result type */}
            <div className="flex-shrink-0">
              {resultType === 'recent' ? (
                <Clock className="h-4 w-4 text-gray-400" />
              ) : (
                <MapPin className="h-4 w-4 text-gray-400" />
              )}
            </div>

            <div className="flex-1">
              <div className="font-medium text-gray-900">{option.text}</div>
              {option.long_text && (
                <div className="text-xs text-gray-500 truncate">
                  {option.long_text}
                </div>
              )}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default AutocompleteDropdown;
