
import { useIsMobile } from '@hooks';
import { listChipsQuery } from '../../constant/list_chips_query';
import FilterChip from '@frontend/CategoryPage/components/FilterChip';
import FilterChips from '@frontend/CategoryPage/mobile/filter_bds/FilterChips';

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
