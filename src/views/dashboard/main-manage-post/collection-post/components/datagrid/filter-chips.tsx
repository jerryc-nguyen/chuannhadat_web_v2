
import { useIsMobile } from '@hooks';
import { listChipsQuery } from '../../constant/list_chips_query';
import FilterChip from '@views/home/components/FilterChip';
import FilterChips from '@mobile/filter_bds/FilterChips';

interface TFilterChipsProps {
  onFilterChipsChanged?: (state: Record<string, A>) => void;
}

export default function PostsFilterChips({ onFilterChipsChanged }: TFilterChipsProps) {
  const isMobile = useIsMobile();
  console.log('isMobile', isMobile);
  return (
    <>
      {isMobile && <FilterChips chipOptions={listChipsQuery} onFilterChipsChanged={onFilterChipsChanged} />}
      {!isMobile && listChipsQuery.map((item) => (
        <FilterChip filterChipItem={item} key={item.id} onChange={onFilterChipsChanged} />
      ))}
    </>
  )
}
