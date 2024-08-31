'use client';
import { Icon } from 'konsta/react';
import React from 'react';
import { IoHeartOutline, IoMenuOutline, IoNotificationsOutline } from 'react-icons/io5';

import useAuth from '@mobile/auth/hooks/useAuth';

export default function MainNavRight() {
  const { currentUser } = useAuth();

  return (
    <>
      {currentUser && (
        <span className="mr-2 flex items-center justify-center rounded-full border p-2">
          <IoNotificationsOutline className="h-5 w-5" />
        </span>
      )}

      <span className="mr-2 flex items-center justify-center rounded-full border p-2">
        <IoHeartOutline className="h-5 w-5" />
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
    </>
  );
}
