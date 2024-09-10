'use client';

import React from 'react';
import { PopoverContent } from '@components/ui/popover';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import { BsCheck2All } from 'react-icons/bs';
import { INotificationResponse } from './types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';

interface IProps {
  notifications: INotificationResponse[];
  total: number;
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
  return (
    <>
      <PopoverContent className="h-[520px] w-80">
        <div className="c-notification__header flex justify-between">
          <Label>Thông báo</Label>
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" checked={isReaded} onClick={handleChangeStatus} />
            <Label htmlFor="airplane-mode">Chưa đọc</Label>
            <div className="c-notification__header-action flex gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild onClick={onMarkReadAll}>
                    <BsCheck2All />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Đánh dấu đã đọc tất cả thông báo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="c-notifications__list custom-scrollbar mt-6 h-[85%] overflow-y-scroll">
          {notifications.map((notify) => (
            <Card
              key={notify.id}
              className="relative mb-4"
              onClick={() => onRedirect(notify.id, notify.is_read)}
            >
              {!notify.is_read && (
                <span className="z-2 absolute left-2 top-2 h-2 w-2 rounded-[100%] bg-red-600" />
              )}
              <CardHeader>
                <CardTitle>{notify.title}</CardTitle>
                <CardDescription>{notify.formatted_created_at}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{notify.description}</p>
              </CardContent>
            </Card>
          ))}
          {total > notifications.length && notifications.length > 0 && (
            <Button onClick={onLoadMore}>Load more</Button>
          )}
        </div>
      </PopoverContent>
    </>
  );
};

export default NotificationsList;
