'use client';
import {
  breadcrumbAtom,
  defaultBreadcrumb,
  IBreadcrumbItem,
} from '@dashboard/DashboardLayout/states/breadcrumbAtom';
import { useSetAtom } from 'jotai';
import React from 'react';
import { usePaginatedNotifications } from './hooks/usePaginatedNotifications';
import NotificationHeader from './NotificationHeader';
import NotificationList from './NotificationList';

const NotificationsDesktop: React.FC = () => {
  const setBreadCrumb = useSetAtom(breadcrumbAtom);
  const { notifications: notificationsList, makeMarkRead } = usePaginatedNotifications();

  React.useEffect(() => {
    const currentBreadCrumb: IBreadcrumbItem[] = [
      {
        link: '/notifications',
        title: 'Thông báo',
        isActive: true,
      },
    ];
    setBreadCrumb((state) => [...state, ...currentBreadCrumb]);
    return () => {
      setBreadCrumb(defaultBreadcrumb);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="space-y-4 md:space-y-6 px-4 md:px-0">
      <NotificationHeader notifications={notificationsList} />
      <NotificationList notifications={notificationsList} onMarkAsRead={makeMarkRead} />
    </section>
  );
};

export default NotificationsDesktop;
