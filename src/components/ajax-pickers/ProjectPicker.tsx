import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OptionForSelect } from '@common/types';
import { autocompleteApi } from '@frontend/CategoryPage/api/autocomplete';
import CmdkOptionPicker from '@components/mobile-ui/CmdkOptionPicker';
import { debounce } from 'lodash-es';
import { toast } from 'sonner';

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

  const { isLoading: isSearching, data: response, refetch } = useQuery({
    queryKey: ['filter_projects', params],
    queryFn: () => autocompleteApi.projects({ ...params, with_recent: true }),
    enabled: true
  });

  const onSearchQueryChange = useCallback((term: string) => {
    setSearchQuery(term);
  }, []);

  const emptyMessage = searchQuery.length > 0 ? 'Không tìm thấy dự án' : 'Vui lòng nhập từ khoá';

  const onDelete = async (option: OptionForSelect) => {
    try {
      await autocompleteApi.deleteRecent(option.value as number);
      toast.success('Đã xóa dự án mới xem gần đây');
      refetch();
    } catch (error) {
      toast.error('Xóa dự án mới xem không thành công');
    }
  };

  return (
    <CmdkOptionPicker
      showDescription={true}
      searchable={true}
      value={value}
      options={response?.data || []}
      onSelect={onSelect}
      onDelete={onDelete}
      emptyMessage={emptyMessage}
      searchPlaceHolder={'Tìm dự án'}
      filterable={false}
      isAjaxSearching={isSearching}
      onSearchQueryChange={onSearchQueryChange}
      disableHeight={true}
    />
  );
}
