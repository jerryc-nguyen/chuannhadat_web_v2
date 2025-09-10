import useModals from '@mobile/modals/hooks';
import useFilterState from './hooks/useFilterState';
import { Button } from '@components/ui/button';
import { FilterChipOption } from './types';

export default function ManagePostsFooterBtsButton({ filterOption }: { filterOption: FilterChipOption }) {
  const { closeModals } = useModals();
  const { applySingleFilter } = useFilterState();

  const onApplyFilter = (filterOption: FilterChipOption) => {
    applySingleFilter(filterOption);
    closeModals();
  };

  return (
    <Button className="w-full" onClick={() => onApplyFilter(filterOption)}>
      Áp dụng
    </Button>
  );
}
