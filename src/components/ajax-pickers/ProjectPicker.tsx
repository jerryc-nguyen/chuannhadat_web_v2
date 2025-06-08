import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OptionForSelect } from '@models';
import { services } from '@api/services';
import CmdkOptionPicker from '@mobile/ui/CmdkOptionPicker';
import { debounce } from 'lodash-es';

interface ProjectPickerProps {
  value?: OptionForSelect;
  onSelect: (option: OptionForSelect) => void;
  extraParams?: Record<string, any>;
}

export default function ProjectPicker({
  value,
  onSelect,
  extraParams = {}
}: ProjectPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  // Create a debounced function that updates debouncedKeyword
  const debouncedSetKeyword = useRef(
    debounce((value: string) => {
      setDebouncedKeyword(value);
    }, 300)
  ).current;

  // Update the debounced value when searchQuery changes
  useEffect(() => {
    debouncedSetKeyword(searchQuery);

    // Cleanup debounce on unmount
    return () => {
      debouncedSetKeyword.cancel();
    };
  }, [searchQuery, debouncedSetKeyword]);

  const params = {
    ...extraParams,
    keyword: debouncedKeyword,
    limit: 8
  };

  const { isLoading: isSearching, data: response } = useQuery({
    queryKey: ['filter_projects', params],
    queryFn: () => services.autocompletes.projects(params),
    enabled: debouncedKeyword.length > 0 || Object.keys(extraParams).length > 0
  });

  const onSearchQueryChange = useCallback((term: string) => {
    setSearchQuery(term);
  }, []);

  const emptyMessage = searchQuery.length > 0 ? 'Không tìm thấy dự án' : 'Vui lòng nhập từ khoá';

  return (
    <CmdkOptionPicker
      searchable={true}
      value={value}
      options={response?.data || []}
      onSelect={onSelect}
      emptyMessage={emptyMessage}
      searchPlaceHolder={'Tìm dự án'}
      filterable={false}
      isAjaxSearching={isSearching}
      onSearchQueryChange={onSearchQueryChange}
    />
  );
}
