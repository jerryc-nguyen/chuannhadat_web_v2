'use client';
import { Icon } from 'konsta/react';
import React from 'react';
import {
  IoHeartOutline,
  IoMenuOutline,
  IoNotificationsOutline,
} from 'react-icons/io5';

export default function RightItem({
  setRightPanelOpened,
}: {
  setRightPanelOpened: (value: boolean) => void;
}) {
  return (
    <>
      <span className="flex items-center justify-center border rounded-full p-2 mr-2">
        <Icon
          ios={
            <IoNotificationsOutline className="w-5 h-5" />
          }
          badgeColors={{ bg: 'bg-red-500' }}
        />
      </span>
      <span className="flex items-center justify-center border rounded-full p-2 mr-2">
        <Icon
          ios={<IoHeartOutline className="w-5 h-5" />}
          badgeColors={{ bg: 'bg-red-500' }}
        />
      </span>
      <div
        onClick={() => setRightPanelOpened(true)}
        className="flex items-center justify-center border rounded-full p-2 mr-2"
      >
        <Icon
          ios={<IoMenuOutline className="w-5 h-5" />}
          badgeColors={{ bg: 'bg-red-500' }}
        />
      </div>
    </>
  );
}
