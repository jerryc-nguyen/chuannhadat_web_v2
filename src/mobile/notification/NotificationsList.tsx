'use client';

import React from 'react';
import { INotificationResponse } from './types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';

interface IProps {
  notifications: INotificationResponse[];
  total: number;
  onLoadMore: () => void;
  onRedirect: (id: number, is_readed: boolean) => void;
}

const NotificationsList: React.FC<IProps> = ({ notifications, total, onLoadMore, onRedirect }) => {
  return (
    <>
      <div className="c-notification__header flex justify-between"></div>
      <div className="c-notifications__list mt-6 h-[85%] overflow-scroll">
        {notifications.map((notify) => (
          <Card className="relative mb-4 mx-2" onClick={() => onRedirect(notify.id, notify.is_read)}>
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
          <Button onClick={onLoadMore}> Load more</Button>
        )}
      </div>
    </>
  );
};

export default NotificationsList;
