'use client';
import { Icon } from 'konsta/react';
import React from 'react';
import { IoHeartOutline, IoMenuOutline, IoNotificationsOutline } from 'react-icons/io5';

import useAuth from '@mobile/auth/hooks/useAuth';
import { Badge } from '@components/ui/badge';
import { usePaginatedNotifications } from '@mobile/notification/hooks';

export default function RightItem({
  setRightPanelOpened,
  setNotifyPanelOpened,
}: {
  setRightPanelOpened: (value: boolean) => void;
  setNotifyPanelOpened: (value: boolean) => void;
}) {
  const { currentUser } = useAuth();
  const { total } = usePaginatedNotifications();

  return (
    <>
      {currentUser && (
        <div className="mr-2 flex items-center justify-center rounded-full border p-2">
          <Icon
            ios={
              <div className="relative" onClick={() => setNotifyPanelOpened(true)}>
                <IoNotificationsOutline className="h-5 w-5" />
                <Badge className="absolute right-[-15px] top-[-18px] ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500">
                  {total}
                </Badge>
              </div>
            }
            badgeColors={{ bg: 'bg-red-500' }}
          />
        </div>
      )}

      <span className="mr-2 flex items-center justify-center rounded-full border p-2">
        <Icon ios={<IoHeartOutline className="h-5 w-5" />} badgeColors={{ bg: 'bg-red-500' }} />
      </span>

      {currentUser && (
        <span className="mr-2 flex items-center justify-center">
          <img
            src={currentUser.avatar_url}
            alt={currentUser.full_name}
            height={36}
            width={36}
            className="rounded-full border"
          />
        </span>
      )}

      <div
        onClick={() => setRightPanelOpened(true)}
        className="mr-2 flex items-center justify-center rounded-full border p-2"
      >
        <Icon ios={<IoMenuOutline className="h-5 w-5" />} badgeColors={{ bg: 'bg-red-500' }} />
      </div>
    </>
  );
}
