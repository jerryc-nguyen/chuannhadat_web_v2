'use client';

import React from 'react';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { BsCheck2All } from 'react-icons/bs';
import { INotificationResponse } from './types';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { Badge } from '@components/ui/badge';
import no_notification from '@assets/images/no-notification.jpg';
import Image from 'next/image';

interface IProps {
  notifications: INotificationResponse[];
  total: number | null;
  onLoadMore: () => void;
  onRedirect: (id: number, is_readed: boolean) => void;
  onMarkReadAll: () => void;
  onGetNotMarkRead: (status: 'read' | 'unread' | null) => void;
}

const NotificationsList: React.FC<IProps> = ({
  notifications,
  total,
  onLoadMore,
  onRedirect,
  onMarkReadAll,
  onGetNotMarkRead,
}) => {
  const [isReaded, setReaded] = React.useState<boolean>(false);
  const handleChangeStatus = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | EventTarget>,
  ) => {
    event.stopPropagation();
    setReaded(!isReaded);
    !isReaded ? onGetNotMarkRead('unread') : onGetNotMarkRead(null);
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
  return (
    <>
      <div className="c-notification__header">
        <div className="flex items-center gap-x-2">
          <h4 className="py-2 pl-5 text-lg font-semibold">Thông báo</h4>
          <Badge className="flex aspect-square h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-500 hover:bg-slate-100">
            {total}
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
              onClick={() => onRedirect(notify.id, notify.is_read)}
            >
              {!notify.is_read && (
                <span className="z-2 absolute right-3 top-3 h-2 w-2 rounded-[100%] bg-primary_color" />
              )}
              <h3 className="pr-5 text-sm font-semibold">{notify.title}</h3>
              <div className="mt-2">
                <p className="text-sm">{notify.description}</p>
                <p className="text-right text-xs font-medium text-muted-foreground">
                  {notify.formatted_created_at}
                </p>
              </div>
            </section>
          ))}
          {total && total > notifications.length && notifications.length > 0 && (
            <Button onClick={onLoadMore}>Tải thêm</Button>
          )}
        </div>
      ) : (
        renderNoNotification()
      )}
      {notifications.length > 0 && (
        <>
          <section className="flex justify-between p-3 pl-5">
            <div className="flex items-center gap-x-3">
              <Switch
                id="airplane-mode"
                className={isReaded ? '!bg-success_color' : ''}
                checked={isReaded}
                onClick={handleChangeStatus}
              />
              <Label htmlFor="airplane-mode">Chưa đọc</Label>
            </div>
            <div onClick={onMarkReadAll} className="flex items-center gap-x-2">
              <BsCheck2All className="text-primary_color" />
              <p className="cursor-pointer text-xs font-semibold text-primary_color hover:underline">
                Đánh dấu đã đọc tất cả
              </p>
            </div>
          </section>
        </>
      )}
      <Separator />
    </>
  );
};

export default NotificationsList;
