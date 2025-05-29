import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OptionForSelect } from '@models';
import { services } from '@api/services';
import CmdkOptionPicker from '@mobile/ui/CmdkOptionPicker';

interface ProjectPickerProps {
  value?: OptionForSelect;
  onSelect: (option: OptionForSelect) => void;
  autocompleteProjectParams?: Record<string, any>;
}

export default function ProjectPicker({
  value,
  onSelect,
  autocompleteProjectParams = {}
}: ProjectPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const params = {
    ...autocompleteProjectParams,
    keyword: searchQuery,
    limit: 8
  };

  const { isLoading: isSearching, data: response } = useQuery({
    queryKey: ['filter_projects', params],
    queryFn: () => services.autocompletes.projects(params),
  });

  const onSearchQueryChange = (term: string) => {
    setSearchQuery(term);
  };

  const emptyMessage = searchQuery.length > 0 ? 'Không tìm thấy dự án' : 'Vui lòng nhập từ khoá';

  return (
    <CmdkOptionPicker
      searchable={true}
      value={value}
      options={response?.data}
      onSelect={onSelect}
      emptyMessage={emptyMessage}
      searchPlaceHolder={'Tìm dự án'}
      filterable={false}
      isAjaxSearching={isSearching}
      onSearchQueryChange={onSearchQueryChange}
    />
  );
}
