import { Button } from '@components/ui/button';
import { OptionForSelect } from '@common/types';
import { HorizontalScrollContainer } from '@components/ui/HorizontalScrollContainer';

interface RecentLocationsProps {
  recentSearches: OptionForSelect[];
  onSelect: (option: OptionForSelect) => void;
}

export default function RecentLocations({ recentSearches, onSelect }: RecentLocationsProps) {
  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <div className='mb-4'>
      <label className="text-sm text-gray-500">
        Tìm kiếm gần đây
      </label>

      <div className="grid grid-cols-1">
        <HorizontalScrollContainer
          dependencies={[recentSearches]}
          scrollAreaClassName="px-0 py-0 mt-2"
        >
          <div className="flex gap-2">
            {recentSearches.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-8 font-normal whitespace-nowrap"
                onClick={() => onSelect(option)}
              >
                {option.text}
              </Button>
            ))}
          </div>
        </HorizontalScrollContainer>
      </div>
    </div>
  );
}
