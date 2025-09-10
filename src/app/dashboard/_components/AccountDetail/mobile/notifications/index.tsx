'use client';
import {
  breadcrumbAtom,
  defaultBreadcrumb,
  IBreadcrumbItem,
} from '@dashboard/DashboardLayout/states/breadcrumbAtom';
import { useSetAtom } from 'jotai';
import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter hook
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { usePaginatedNotifications } from '@hooks/usePaginatedNotifications';

const NotificationsMobile: React.FC = () => {
  const setBreadCrumb = useSetAtom(breadcrumbAtom);
  const router = useRouter(); // Initialize the router
  const { notifications: notificationsList } = usePaginatedNotifications();

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
  }, []);

  const handleNotificationClick = (redirectUrl: string) => {
    // Redirect to the notification URL
    router.push(redirectUrl);
  };

  return (
    <section>
      <div className="max-w-full">
        <h2 className="text-2xl font-semibold text-gray-900">Thông báo</h2>
        <div className="my-2 border-b border-gray-200"></div>
        <Card className="m-auto mt-3 h-full w-full">
          <CardHeader className="pb-[15px]">
            <CardTitle className="font-bold text-secondary">Danh sách thông báo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-3 text-12">
            {notificationsList.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.redirect_url)} // Add onClick handler
                className={`flex cursor-pointer items-start justify-between rounded-lg border-b border-gray-200 px-2 py-4 ${notification.is_read ? 'bg-gray-100' : 'bg-[#cde8ff]'}`}
              >
                <div className={`flex-1 ${notification.is_read ? 'font-normal' : 'font-bold'}`}>
                  <p className="text-gray-900">{notification.title}</p>
                  <p className="text-gray-500">{notification.description}</p>
                  <p className="text-sm text-gray-400">{notification.formatted_created_at}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default NotificationsMobile;
