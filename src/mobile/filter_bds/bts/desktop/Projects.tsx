import useModals from '@mobile/modals/hooks';
import useFilterState from '../../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@models';
import CmdkOptionPicker from '@mobile/ui/CmdkOptionPicker';
import { defaultProjects } from '@mobile/filter_bds/constants';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { services } from '@api/services';

export default function Projects() {
  const { getLocalFieldValue, setLocalFieldValue, filterFieldOptions } = useFilterState();
  const value = getLocalFieldValue(FilterFieldName.Project);

  const [searchQuery, setSearchQuery] = useState('');

  const params = {
    keyword: searchQuery,
    limit: 8
  }

  const { isLoading: isSearching, data: response } = useQuery({
    queryKey: ['filter_projects', params],
    queryFn: () => services.autocompletes.projects(params),
  });

  console.log('response', response)

  const onSelect = (option: OptionForSelect) => {
    console.log('onSelect option', option)
    setLocalFieldValue(FilterFieldName.Project, option);
  }

  const onSearchQueryChange = (term: string) => {
    console.log('onSearchQueryChange option', term)
    setSearchQuery(term);
  }

  const emptyMessage = searchQuery.length > 0 ? 'Không tìm thấy dự án' : 'Vui lòng nhập từ khoá'

  return (
    <CmdkOptionPicker
      searchable={true}
      value={value}
      options={searchQuery.length > 0 ? response?.data : defaultProjects}
      onSelect={onSelect}
      emptyMessage={emptyMessage}
      searchPlaceHolder={'Tìm dự án'}
      filterable={false}
      isAjaxSearching={isSearching}
      onSearchQueryChange={onSearchQueryChange}
    />
  );
}
