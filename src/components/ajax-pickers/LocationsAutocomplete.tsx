import { useState, useCallback, useEffect, useRef } from 'react';
import { OptionForSelect } from '@common/types';
import { debounce } from 'lodash-es';
import { useAutocompleteSearch } from '@frontend/Maps/components/Autocomplete/hooks/useAutocompleteSearch';
import { CmdkOptionsAutocomplete } from '@components/mobile-ui/CmdkOptionsAutocomplete';

interface LocationsAutocompleteProps {
  value?: OptionForSelect;
  onSelect: (option: OptionForSelect) => void;
  extraParams?: Record<string, any>;
}

export default function LocationsAutocomplete({
  value,
  onSelect
}: LocationsAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const { results, recentSearches, loading, resultType, loadRecentSearches, mergeWithRecentSearches, deleteRecentSearch } = useAutocompleteSearch();

  // Create a debounced function that updates debouncedKeyword
  const debouncedSetKeyword = useRef(
    debounce((value: string) => {
      setDebouncedKeyword(value);
    }, 300)
  ).current;

  // Update the debounced value when searchQuery changes
  useEffect(() => {
    mergeWithRecentSearches(searchQuery);

    // Cleanup debounce on unmount
    return () => {
      debouncedSetKeyword.cancel();
    };
  }, [searchQuery, debouncedSetKeyword, mergeWithRecentSearches]);


  const onSearchQueryChange = useCallback((term: string) => {
    setSearchQuery(term);
  }, []);

  const emptyMessage = searchQuery.length > 0 ? 'Không tìm thấy dự án' : 'Vui lòng nhập từ khoá';

  return (
    <CmdkOptionsAutocomplete
      keyword={debouncedKeyword}
      onSelectedValueChange={onSelect}
      items={results || []}
      emptyMessage={emptyMessage}
      onSearch={onSearchQueryChange}
      isLoading={loading}
    />
  );
}
