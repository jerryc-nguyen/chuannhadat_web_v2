'use client';
import { cn } from '@common/utils';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import NotificationsList from '@desktop/notification/NotificationsList';
import { usePaginatedNotifications } from '@hooks/usePaginatedNotifications';
import useAuth from '@mobile/auth/hooks/useAuth';
import { LucideBell } from 'lucide-react';
import React, { useMemo } from 'react';

type NotificationIconProps = {
  isLogged: boolean;
};

const NotificationIcon: React.FC<NotificationIconProps> = ({ isLogged }) => {
  const { totalNotificationlUnread, loadMore } = usePaginatedNotifications();
  const { currentUser } = useAuth();
  const handleRedirect = () => {
    return;
  };
  React.useEffect(() => {
    if (currentUser?.id) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);
  const showBadge = useMemo(() => {
    return totalNotificationlUnread !== null && totalNotificationlUnread > 0;
  }, [totalNotificationlUnread]);

  if (!isLogged) return null;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button size={'icon'} variant={'outline'} className="rounded-full">
            <LucideBell className="h-5 w-5" />
          </Button>

          {showBadge && (
            <Badge
              className={cn(
                'absolute -right-2 top-0 ml-auto flex h-6 w-6 shrink-0 -translate-y-1/2 items-center justify-center rounded-full',
                totalNotificationlUnread !== null
                  ? 'bg-error_color hover:bg-error_color'
                  : 'bg-transparent hover:bg-transparent',
              )}
            >
              {totalNotificationlUnread !== null ? (
                totalNotificationlUnread
              ) : (
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary_color opacity-75" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-primary_color" />
                </span>
              )}
            </Badge>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[23rem] p-0" side="bottom" align='end'>
        <NotificationsList onRedirect={handleRedirect} />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationIcon;
