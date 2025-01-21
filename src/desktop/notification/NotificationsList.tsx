'use client';

import React from 'react';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { BsCheck2All } from 'react-icons/bs';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { Badge } from '@components/ui/badge';
import no_notification from '@assets/images/no-notification.jpg';
import Image from 'next/image';
import { usePaginatedNotifications } from '@hooks';

interface IProps {
  onRedirect: (notif: A) => void;
}

const NotificationsList: React.FC<IProps> = ({ onRedirect }) => {
  const {
    isMarkAllRead,
    notifications,
    totalCount,
    handleLoadNext,
    handleFilter,
    typeFilter,
    makeMarkReadAll,
    currentTotalCount,
  } = usePaginatedNotifications();
  const handleChangeStatus = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | EventTarget>,
  ) => {
    event.stopPropagation();
    handleFilter();
  };

  const renderNoNotification = () => (
    <section className="mb-5 flex flex-col items-center justify-center p-5">
      <Image className="w-1/2" src={no_notification} alt="no-notification" />
      <h3 className="text-lg font-bold">Không có thông báo nào</h3>
      <p className="mt-2 w-3/4 text-center text-sm text-foreground">
        Bạn hiện không có thông báo nào, hãy quay lại sau.
      </p>
    </section>
  );
  if (totalCount === 0) return renderNoNotification();

  return (
    <>
      <div className="c-notification__header">
        <div className="flex items-center gap-x-2">
          <h4 className="py-2 pl-5 text-lg font-semibold">Thông báo</h4>
          <Badge className="flex aspect-square h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs text-secondary hover:bg-slate-100">
            {currentTotalCount}
          </Badge>
        </div>
        <Separator />
      </div>
      {notifications.length > 0 ? (
        <div className="c-notifications__list flex max-h-[50vh] flex-col gap-y-4 overflow-y-scroll px-3 py-4 pr-2">
          {notifications.map((notify) => (
            <section
              key={notify.id}
              className="relative cursor-pointer border-b py-2 pl-5 pr-3 transition-all hover:rounded-lg hover:bg-slate-50 hover:shadow-sm"
              onClick={() => onRedirect(notify)}
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
          {totalCount && totalCount > notifications.length && notifications.length > 0 ? (
            <Button
              className="flex-center bg-slate-50 font-semibold hover:bg-slate-200"
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
      <>
        <section className="flex justify-between p-3 pl-5">
          <div className="flex items-center gap-x-3">
            <Switch
              id="airplane-mode"
              className={typeFilter === 'unread' ? '!bg-success_color' : ''}
              checked={typeFilter === 'unread'}
              onClick={handleChangeStatus}
            />
            <Label htmlFor="airplane-mode">Chưa đọc</Label>
          </div>
          {!isMarkAllRead ? (
            <div onClick={() => makeMarkReadAll()} className="flex items-center gap-x-2">
              <BsCheck2All className="text-primary_color" />
              <p className="cursor-pointer text-xs font-semibold text-primary_color hover:underline">
                Đánh dấu đã đọc tất cả
              </p>
            </div>
          ) : null}
        </section>
      </>
      <Separator />
    </>
  );
};

export default NotificationsList;
