import useModals from '@frontend/features/layout/mobile-modals/hooks';
import { Button } from '@components/ui/button';
import { Loader2 } from 'lucide-react';
import { FilterChipOption } from '@common/types';

type Props = {
  filterOption: FilterChipOption;
  onApplyFilter: (filterOption: FilterChipOption) => void;
  previewCount: number;
  isLoading: boolean;
}

export default function FooterBtsButton({
  filterOption,
  onApplyFilter,
  previewCount,
  isLoading
}: Props) {
  const { closeModals } = useModals();

  const handleApplyFilter = () => {
    onApplyFilter(filterOption);
    closeModals();
  };

  return (
    <Button disabled={isLoading} className="w-full" onClick={handleApplyFilter}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? 'Đang tải' : `Xem ${previewCount} kết quả`}
    </Button>
  );
}
