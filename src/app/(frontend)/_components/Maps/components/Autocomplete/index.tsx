'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { SEARCH_BOX_WIDTH } from '../../constants';
import { useAutocompleteSearch } from './hooks/useAutocompleteSearch';
import { useClickOutside, useTrackAction } from '@common/hooks';
import { OptionForSelect } from '@common/types';
import { AutocompleteDropdown } from './components';
import { useApp } from '@common/context/AppContext';

interface AutocompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: OptionForSelect) => void;
  onSubmit?: (query: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  value = '',
  onChange,
  onSelect,
  onSubmit,
  placeholder = 'Tìm kiếm',
  className = '',
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentLoaded, setRecentLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { trackAction } = useTrackAction();
  const { isMobile } = useApp();

  // Use the search hook
  const { results, recentSearches, loading, resultType, loadRecentSearches, mergeWithRecentSearches, deleteRecentSearch } = useAutocompleteSearch();

  // Sync external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Reset recent loaded flag when input is cleared
  useEffect(() => {
    if (!inputValue.trim()) {
      setRecentLoaded(false);
    }
  }, [inputValue]);

  // Handle click outside to close dropdown (but keep results)
  useClickOutside(containerRef, () => {
    setIsOpen(false);
    setSelectedIndex(-1);
  }, isOpen);

  // Debounced search effect - merge recent searches with search results
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      mergeWithRecentSearches(inputValue);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue, mergeWithRecentSearches]);

  // Show dropdown when recent searches are loaded and input is empty
  useEffect(() => {
    if (!inputValue.trim() && recentSearches.length > 0 && resultType === 'recent') {
      setIsOpen(true);
      setSelectedIndex(-1);
    }
  }, [recentSearches, inputValue, resultType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
    // mergeWithRecentSearches will handle merging recent searches with search results
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleOptionSelect(results[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit?.(inputValue.trim());
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleOptionSelect = (option: OptionForSelect) => {
    setInputValue(option.text || '');
    onChange?.(option.text || '');
    onSelect?.(option);
    setIsOpen(false);
    setSelectedIndex(-1);
    trackAction({ target_type: option.data_type || '', target_id: option.data?.id + '', action: 'view_map_object' });
    loadRecentSearches({ limit: 5 });
    // Don't clear results - keep them for when user focuses again
  };

  const handleFocus = () => {
    // Show dropdown if we have results from previous search
    if (results.length > 0) {
      setIsOpen(true);
    } else if (!inputValue.trim()) {
      // Load recent searches only once on focus
      if (!recentLoaded) {
        loadRecentSearches({ limit: 5 });
        setRecentLoaded(true);
      } else if (recentSearches.length > 0) {
        // If recent searches are already loaded, show them
        setIsOpen(true);
      }
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange?.('');
    setRecentLoaded(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`${isMobile ? 'w-full' : 'relative'}  ${className}`}>
      <form onSubmit={handleSubmit}>
        <div
          className="flex items-center bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg hover:border-gray-300 focus-within:shadow-lg focus-within:border-blue-300 transition-all duration-200"
          style={isMobile ? {} : { width: SEARCH_BOX_WIDTH }}
        >
          <div className="pl-4 pr-2">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            disabled={disabled}
            onClick={() => { console.log('onClick'); }}
            className="flex-1 px-1 py-2 text-base border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 focus:text-gray-900 focus:placeholder-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={isMobile ? { width: 'calc(100% - 150px)' } : {}}
          />
          {inputValue.trim() && (
            <div className="pr-2">
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          )}
          {loading && (
            <div className="pr-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
            </div>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <AutocompleteDropdown
          options={results}
          selectedIndex={selectedIndex}
          resultType={resultType}
          onSelect={handleOptionSelect}
          onDelete={deleteRecentSearch}
          onClose={() => setIsOpen(false)}
          getIconType={(option) => ((option as OptionForSelect & { _resultType?: 'recent' | 'search' })._resultType || 'search')}
        />
      )}
    </div>
  );
};

export default Autocomplete;
