'use client';
import { cn } from '@common/utils';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { LucideBell } from 'lucide-react';
import React from 'react';

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@components/ui/sheet';
import { usePaginatedNotifications } from '@hooks/usePaginatedNotifications';
import no_notification from '@assets/images/no-notification.jpg';
import Image from 'next/image';
import { Switch } from '@components/ui/switch';
import { Label } from '@components/ui/label';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
type NotificationIconProps = {
  isLogged: boolean;
};

const NotificationIcon: React.FC<NotificationIconProps> = ({ isLogged }) => {
  const [openModalNotifications, setOpenModalNotifications] = React.useState<boolean>(false);
  const {
    isMarkAllRead,
    notifications,
    handleFilter,
    handleLoadNext,
    typeFilter,
    totalUnread,
    currentTotalCount,
    makeMarkReadAll,
  } = usePaginatedNotifications();
  const router = useRouter();
  const [isShowBadge, setIsShowBadge] = React.useState<boolean>(true);

  const handleMarkReadAll = () => {
    makeMarkReadAll();
  };
  const handleChangeStatus = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | EventTarget>,
  ) => {
    event.stopPropagation();
    handleFilter();
  };
  const renderNoNotification = () => (
    <section className="flex flex-col items-center justify-center">
      <Image className="w-3/4" src={no_notification} alt="no-notification" />
      <h3 className="text-lg font-bold">Không có thông báo nào</h3>
      <p className="mt-2 px-4 text-center text-sm text-foreground">
        Bạn hiện không có thông báo nào, hãy quay lại sau.
      </p>
    </section>
  );

  const handleRedirect = () => {
    router.push('/dashboard/notifications');
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
    <Sheet onOpenChange={setOpenModalNotifications} open={openModalNotifications}>
      <SheetTrigger asChild>
        <div className="relative">
          <Button
            onClick={() => {
              setOpenModalNotifications(true);
            }}
            size={'icon'}
            variant={'outline'}
            className="rounded-full"
          >
            <LucideBell className="h-5 w-5" />
          </Button>

          {isShowBadge && (
            <Badge
              className={cn(
                'absolute -right-1 top-0 ml-auto flex aspect-square h-5 w-5 shrink-0 -translate-y-1/2 items-center justify-center rounded-full !p-0',
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
        </div>
      </SheetTrigger>
      <SheetContent className="flex w-[90vw] flex-col gap-y-0 p-0">
        <SheetHeader>
          <SheetTitle className="flex justify-start gap-x-2 p-3">
            Thông báo
            <Badge className="flex aspect-square h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs text-secondary hover:bg-slate-100">
              {currentTotalCount}
            </Badge>
          </SheetTitle>
          <Separator className="!mt-0" />
        </SheetHeader>
        <div className="flex flex-1 flex-col overflow-y-auto">
          {notifications.length > 0 ? (
            <div>
              {notifications.map((notify) => (
                <section
                  key={notify.id}
                  className="relative cursor-pointer border-b px-4 py-3 transition-all hover:rounded-lg hover:bg-slate-50 hover:shadow-sm"
                  onClick={handleRedirect}
                >
                  {!notify.is_read && (
                    <span className="z-2 absolute right-3 top-3 h-2 w-2 rounded-[100%] bg-primary_color" />
                  )}
                  <h3 className="pr-5 text-sm font-semibold">{notify.title}</h3>
                  <div className="mt-2">
                    <p className="text-sm">{notify.description}</p>
                    <p className="text-right text-xs font-medium text-secondary">
                      {notify.formatted_created_at}
                    </p>
                  </div>
                </section>
              ))}
              {notifications.length < currentTotalCount ? (
                <Button
                  className="mx-auto my-4 block w-[90%] bg-slate-50 px-5"
                  variant={'outline'}
                  onClick={() => handleLoadNext()}
                >
                  Tải thêm
                </Button>
              ) : null}
            </div>
          ) : (
            renderNoNotification()
          )}
        </div>
        <SheetFooter>
          <section className="flex justify-between p-3">
            <div className="flex items-center gap-x-3">
              <Switch
                id="airplane-mode"
                className={typeFilter === 'unread' ? '!bg-success_color' : ''}
                checked={typeFilter === 'unread'}
                onClick={handleChangeStatus}
              />
              <Label htmlFor="airplane-mode">Chưa đọc</Label>
            </div>
            <div onClick={handleMarkReadAll} className="flex items-center gap-x-2">
              {!isMarkAllRead ? <Check className="text-primary_color" /> : null}
            </div>
          </section>
          <Separator />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationIcon;
