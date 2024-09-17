import useModals from '@mobile/modals/hooks';
import useFilterState from './hooks/useFilterState';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';
import { Button } from '@components/ui/button';
import { LuLoader2 } from 'react-icons/lu';

export default function FooterOverviewBtsButton() {
  const { closeModals } = useModals();
  const { applyAllFilters, buildFilterParams } = useFilterState();
  const filterParams = buildFilterParams({ withLocal: true });

  const { isLoading, data } = useQuery({
    queryKey: ['searchs', filterParams],
    queryFn: () => searchApi(filterParams),
  });

  const onApplyFilter = () => {
    applyAllFilters();

    closeModals();
  };
  return (
    <Button disabled={isLoading} className="w-full" onClick={onApplyFilter}>
      {isLoading && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? 'Đang tải' : `Xem ${data?.pagination?.total_count} kết quả`}
    </Button>
  );
}
