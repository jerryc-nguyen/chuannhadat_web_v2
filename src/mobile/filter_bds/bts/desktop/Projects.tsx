import useFilterState from '../../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@models';
import CmdkOptionPicker from '@mobile/ui/CmdkOptionPicker';
import { defaultProjects } from '@mobile/filter_bds/constants';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { services } from '@api/services';
import useMainContentNavigator from '@components/main-content-navigator/hooks';

export default function Projects() {
  const { getLocalFieldValue, setLocalFieldValue } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.Project);
  const { autocompleteProjectParams } = useMainContentNavigator()
  const [searchQuery, setSearchQuery] = useState('');

  const params = {
    ...autocompleteProjectParams,
    keyword: searchQuery,
    limit: 8
  }

  const { isLoading: isSearching, data: response } = useQuery({
    queryKey: ['filter_projects', params],
    queryFn: () => services.autocompletes.projects(params),
  });

  const onSelect = (option: OptionForSelect) => {
    setLocalFieldValue(FilterFieldName.Project, option);
  }

  const onSearchQueryChange = (term: string) => {
    setSearchQuery(term);
  }

  const emptyMessage = searchQuery.length > 0 ? 'Không tìm thấy dự án' : 'Vui lòng nhập từ khoá'

  return (
    <CmdkOptionPicker
      searchable={true}
      value={value}
      options={response?.data?.length > 0 ? response?.data : defaultProjects}
      onSelect={onSelect}
      emptyMessage={emptyMessage}
      searchPlaceHolder={'Tìm dự án'}
      filterable={false}
      isAjaxSearching={isSearching}
      onSearchQueryChange={onSearchQueryChange}
    />
  );
}
