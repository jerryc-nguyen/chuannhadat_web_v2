
import { useIsMobile } from '@common/hooks';
import { listChipsQuery } from '../../constant/list_chips_query';
import FilterChip from '@app/(frontend)/_components/features/search/filter-conditions/desktop/FilterChip';
import FilterChips from '@app/(frontend)/_components/features/search/filter-conditions/mobile/FilterChips';

interface TFilterChipsProps {
  onFilterChipsChanged?: (state: Record<string, A>) => void;
}

export default function PostsFilterChips({ onFilterChipsChanged }: TFilterChipsProps) {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile && <div style={{ marginLeft: '-1em', color: 'red' }}><FilterChips chipOptions={listChipsQuery} onFilterChipsChanged={onFilterChipsChanged} /></div>}
      {!isMobile && listChipsQuery.map((item) => (
        <FilterChip filterChipItem={item} key={item.id} onChange={onFilterChipsChanged} />
      ))}
    </>
  )
}
