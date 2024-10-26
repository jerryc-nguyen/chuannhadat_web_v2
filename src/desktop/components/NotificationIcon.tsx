import { cn } from '@common/utils';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import NotificationsList from '@desktop/notification/NotificationsList';
import { usePaginatedNotifications } from '@hooks/usePaginatedNotifications';
import { LucideBell } from 'lucide-react';
import React from 'react';

type NotificationIconProps = {
  isLogged: boolean;
};

const NotificationIcon: React.FC<NotificationIconProps> = ({ isLogged }) => {
  const { total, notifications, loadMore, onFilter } = usePaginatedNotifications();

  const handleRedirect = () => {
    return;
  };
  const handleGetNotMarkRead = (status: 'unread' | 'read' | null) => onFilter(status);
  if (!isLogged) return null;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button size={'icon'} variant={'outline'} className="rounded-full">
            <LucideBell className="h-5 w-5" />
          </Button>

          <Badge
            className={cn(
              'absolute -right-2 top-0 ml-auto flex h-6 w-6 shrink-0 -translate-y-1/2 items-center justify-center rounded-full',
              total !== null
                ? 'bg-error_color hover:bg-error_color'
                : 'bg-transparent hover:bg-transparent',
            )}
          >
            {total !== null ? (
              total
            ) : (
              <span className="relative flex h-4 w-4 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary_color opacity-75" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-primary_color" />
              </span>
            )}
          </Badge>
        </div>
      </PopoverTrigger>
      <PopoverContent className="left-1/2 w-[23rem] -translate-x-1/2 p-0">
        <NotificationsList
          notifications={notifications}
          total={total}
          onLoadMore={loadMore}
          onRedirect={handleRedirect}
          onGetNotMarkRead={handleGetNotMarkRead}
        />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationIcon;
