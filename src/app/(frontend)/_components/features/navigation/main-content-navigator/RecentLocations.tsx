import { Button } from '@components/ui/button';
import { OptionForSelect } from '@common/types';
import { HorizontalScrollContainer } from '@components/ui/HorizontalScrollContainer';
import { Clock, X } from 'lucide-react';
import { cn } from '@common/utils';

interface RecentLocationsProps {
  recentSearches: OptionForSelect[];
  onSelect: (option: OptionForSelect) => void;
  onDelete?: (option: OptionForSelect) => void;
}

export default function RecentLocations({ recentSearches, onSelect, onDelete }: RecentLocationsProps) {
  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <div className='mb-4'>
      <label className="text-sm text-gray-500 flex items-center">
        <Clock className={cn('mr-2 h-4 w-4 opacity-70')} />
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
                <span className="inline-flex items-center gap-2">
                  <span>{option.text}</span>
                  {onDelete && (
                    <span
                      role="button"
                      aria-label="Xóa tìm kiếm gần đây"
                      className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded hover:bg-muted"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(option);
                      }}
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </span>
                  )}
                </span>
              </Button>
            ))}
          </div>
        </HorizontalScrollContainer>
      </div>
    </div>
  );
}
