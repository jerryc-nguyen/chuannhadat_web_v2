import useModals from '@mobile/modals/hooks';
import useFilterState from './hooks/useFilterState';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';
import { Button } from '@components/ui/button';
import { LuLoader2 } from 'react-icons/lu';
import { FilterChipOption } from './types';

type Props = {
  filterOption: FilterChipOption;
  onChange?: (filterState: Record<string, A>) => void;
}

export default function FooterBtsButton({ filterOption, onChange }: Props) {
  const { closeModals } = useModals();
  const { applySingleFilter, buildFilterParams } = useFilterState();
  const filterParams = buildFilterParams({ withLocal: true });

  const { isLoading, data } = useQuery({
    queryKey: ['FooterBtsButton', filterParams],
    queryFn: () => searchApi(filterParams),
  });

  const onApplyFilter = (filterOption: FilterChipOption) => {
    const states = applySingleFilter(filterOption);
    if (onChange) {
      onChange(states)
    }
    closeModals();
  };

  return (
    <Button disabled={isLoading} className="w-full" onClick={() => onApplyFilter(filterOption)}>
      {isLoading && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? 'Đang tải' : `Xem ${data?.pagination?.total_count} kết quả`}
    </Button>
  );
}
