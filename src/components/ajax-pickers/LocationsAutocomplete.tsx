import { useState, useEffect, useRef } from 'react';
import { OptionForSelect } from '@common/types';
import { debounce } from 'lodash-es';
import { useAutocompleteSearch } from '@frontend/Maps/components/Autocomplete/hooks/useAutocompleteSearch';
import { CmdkOptionsAutocomplete } from '@components/mobile-ui/CmdkOptionsAutocomplete';

interface LocationsAutocompleteProps {
  onSelect: (option: OptionForSelect) => void;
  extraParams?: Record<string, any>;
  placeholder?: string;
  autocompleteScope?: string;
}

export default function LocationsAutocomplete({
  onSelect,
  placeholder,
  autocompleteScope = 'location_navigator'
}: LocationsAutocompleteProps) {
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const { results, loading, mergeWithRecentSearches } = useAutocompleteSearch({ scope: autocompleteScope });

  // Create a debounced function that updates debouncedKeyword
  const debouncedSetKeyword = useRef(
    debounce((value: string) => {
      setDebouncedKeyword(value);
    }, 300)
  ).current;

  // Update the debounced value when searchQuery changes
  useEffect(() => {
    mergeWithRecentSearches(debouncedKeyword);

    // Cleanup debounce on unmount
    return () => {
      debouncedSetKeyword.cancel();
    };
  }, [debouncedKeyword, debouncedSetKeyword, mergeWithRecentSearches]);

  const emptyMessage = debouncedKeyword.length > 0 ? 'Không tìm thấy kết quả' : 'Vui lòng nhập từ khoá';

  return (
    <CmdkOptionsAutocomplete
      keyword={debouncedKeyword}
      onSelectedValueChange={onSelect}
      items={results || []}
      emptyMessage={emptyMessage}
      onSearch={debouncedSetKeyword}
      isLoading={loading}
      placeholder={placeholder || 'Tìm kiếm khu vực / dự án'}
    />
  );
}
