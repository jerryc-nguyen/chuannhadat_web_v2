import { searchApi } from '../api/search';
import { FilterState } from '../mobile/filter_bds/types';
import { ISeachAuthorPayload } from '@common/models/modelPayload';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export const useTopAuthors = (filterState: FilterState) => {
  const payloadTopAuthors: ISeachAuthorPayload = React.useMemo(() => {
    const filterParams = {
      business_type: filterState.businessType?.value as string,
      category_type: filterState.categoryType?.value as string,
      city_id: Number(filterState.city?.value),
      district_id: Number(filterState.district?.value),
      ward_id: Number(filterState.ward?.value),
      project_id: 0,
    };
    return Object.fromEntries(Object.entries(filterParams).filter(([, value]) => !!value));
  }, [filterState]);

  const { data: topAuthors, isFetching } = useQuery({
    queryKey: ['top-authors', payloadTopAuthors],
    queryFn: () => searchApi.topAuthors(payloadTopAuthors),
    enabled: Object.values(payloadTopAuthors).some((value) => !!value),
    select: (data) => data.data,
  });

  return {
    filterState,
    topAuthors: topAuthors ?? [],
    isFetching,
  };
};
