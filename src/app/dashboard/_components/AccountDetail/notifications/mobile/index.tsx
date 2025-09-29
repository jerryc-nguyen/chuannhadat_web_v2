'use client';
import React from 'react';
import { usePaginatedNotifications } from '../hooks/usePaginatedNotifications';
import NotificationHeader from './NotificationHeader';
import NotificationList from '../NotificationList';
import { useNotificationsBreadcrumb } from '../../hooks';
import MobileContainer from '@dashboard/FinancialManagement/components/MobileContainer';

const NotificationsMobile: React.FC = () => {
  const { notifications: notificationsList, makeMarkRead, makeMarkReadAll } = usePaginatedNotifications();

  // Set up breadcrumb for notifications page
  useNotificationsBreadcrumb();

  return (
    <MobileContainer>
      <div className="space-y-4">
        <NotificationHeader
          notifications={notificationsList}
          onMarkAllAsRead={makeMarkReadAll}
        />
        <NotificationList notifications={notificationsList} onMarkAsRead={makeMarkRead} />
      </div>
    </MobileContainer>
  );
};

export default NotificationsMobile;
