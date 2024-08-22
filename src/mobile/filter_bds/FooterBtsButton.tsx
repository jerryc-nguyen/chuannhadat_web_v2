import { Button, Preloader } from 'konsta/react';
import { FilterChipOption } from './FilterChips';
import useModals from '@mobile/modals/hooks';
import useFilterState from './hooks/useFilterState';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';

export default function FooterBtsButton({
  filterOption,
}: {
  filterOption: FilterChipOption;
}) {
  const { closeModals } = useModals();
  const { applySingleFilter, buildFilterParams } = useFilterState();
  const filterParams = buildFilterParams();

  const { isLoading, data } = useQuery({
    queryKey: ['searchs', filterParams],
    queryFn: async () => {
      const response = await searchApi(filterParams);
      // return await response.json();
      return response;
    },
  });

  const onApplyFilter = (filterOption: FilterChipOption) => {
    applySingleFilter(filterOption);
    closeModals();
  };

  return (
    <Button onClick={() => onApplyFilter(filterOption)}>
      Xem {data?.pagination?.total_count} kết quả
      {isLoading && (
        <Preloader className='text-white small' size='w-5 h-5' />
      )}
    </Button>
  );
}
