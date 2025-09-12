'use client';
import { cn } from '@common/utils';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import NotificationsList from '@components/desktop/notification/NotificationsList';
import { usePaginatedNotifications } from '@frontend/features/notification/hooks/usePaginatedNotifications';
import { LucideBell } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

type NotificationIconProps = {
  isLogged: boolean;
};

const NotificationIcon: React.FC<NotificationIconProps> = ({ isLogged }) => {
  const { totalUnread, notifications } = usePaginatedNotifications();
  const searchParams = useSearchParams();
  const hideDangtinButton = searchParams?.get('hide_create_post') == 'true';
  const router = useRouter();
  const [isShowBadge, setIsShowBadge] = React.useState<boolean>(true);

  const handleRedirect = (notif: A) => {
    router.push(notif.redirect_url);
  };
  React.useEffect(() => {
    if (notifications.length > 0 && totalUnread > 0) {
      setIsShowBadge(true);
    } else {
      setIsShowBadge(false);
    }
  }, [notifications, totalUnread]);
  if (!isLogged) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={'icon'} variant={'outline'} className="rounded-full relative" aria-label="Xem thông báo">
          <LucideBell className="h-5 w-5" />

          {isShowBadge && (
            <Badge
              className={cn(
                'absolute -right-2 top-0 ml-auto flex aspect-square h-5 w-5 shrink-0 -translate-y-[7px] items-center justify-center rounded-full p-0 !text-[10px]',
                totalUnread !== 0
                  ? 'bg-error_color hover:bg-error_color'
                  : 'bg-transparent hover:bg-transparent',
              )}
            >
              {totalUnread !== 0 ? (
                totalUnread
              ) : (
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary_color opacity-75" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-primary_color" />
                </span>
              )}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('w-[23rem] p-0', {
          'left-1/2 -translate-x-1/2': !hideDangtinButton,
        })}
        side="bottom"
        align="center"
      >
        <NotificationsList onRedirect={handleRedirect} />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationIcon;
