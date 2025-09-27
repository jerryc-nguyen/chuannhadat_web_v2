'use client';
import React from 'react';
import { usePaginatedNotifications } from '../hooks/usePaginatedNotifications';
import NotificationHeader from './NotificationHeader';
import NotificationList from '../NotificationList';
import { useNotificationsBreadcrumb } from '../../hooks';

const NotificationsMobile: React.FC = () => {
  const { notifications: notificationsList, makeMarkRead, makeMarkReadAll } = usePaginatedNotifications();

  // Set up breadcrumb for notifications page
  useNotificationsBreadcrumb();

  return (
    <section className="space-y-4 md:space-y-6 px-4 md:px-0">
      <NotificationHeader
        notifications={notificationsList}
        onMarkAllAsRead={makeMarkReadAll}
      />
      <NotificationList notifications={notificationsList} onMarkAsRead={makeMarkRead} />
    </section>
  );
};

export default NotificationsMobile;
