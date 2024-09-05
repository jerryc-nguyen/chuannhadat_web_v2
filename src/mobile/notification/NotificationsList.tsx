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
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            className="relative mx-2 mb-4"
            onClick={() => onRedirect(notif.id, notif.is_read)}
          >
            {!notif.is_read && (
              <span className="z-2 absolute left-2 top-2 h-2 w-2 rounded-[100%] bg-red-600" />
            )}
            <CardHeader>
              <CardTitle>{notif.title}</CardTitle>
              <CardDescription>{notif.formatted_created_at}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{notif.description}</p>
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
