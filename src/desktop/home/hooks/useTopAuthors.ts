import { services } from '@api/services';
import { filterStateAtom } from '@mobile/filter_bds/states';
import { ISeachAuthorPayload } from '@models/modelPayload';
import { useQuery } from '@tanstack/react-query';
import { useAtom, useSetAtom } from 'jotai';
import React from 'react';
import { listTopAuthorsAtom } from '../states';

export const useTopAuthors = () => {
  const setTopAuthors = useSetAtom(listTopAuthorsAtom);
  const [filterState] = useAtom(filterStateAtom);
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
    queryFn: () => services.searchs.topAuthors(payloadTopAuthors),
    enabled: Object.values(payloadTopAuthors).some((value) => !!value),
    select: (data) => data.data,
  });
  React.useEffect(() => {
    if (topAuthors && !isFetching) {
      setTopAuthors(topAuthors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, topAuthors]);
  return {
    filterState,
  };
};
