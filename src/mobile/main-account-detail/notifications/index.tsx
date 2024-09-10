'use client';
import { breadcrumbAtom, IBreadcrumbItem } from '@desktop/dashboard/states/breadcrumbAtom';
import { useSetAtom } from 'jotai';
import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter hook
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { usePaginatedNotifications } from '@desktop/notification/hooks';

const NotificationsMobile: React.FC = () => {
  const setBreadCrumb = useSetAtom(breadcrumbAtom);
  const router = useRouter(); // Initialize the router
  const { notifications: notificationsList } = usePaginatedNotifications();

  React.useEffect(() => {
    const currentBreadCrumb: IBreadcrumbItem[] = [
      {
        link: 'notifications',
        title: 'Thông báo',
        isActive: true,
      },
    ];
    setBreadCrumb((state) => [...state, ...currentBreadCrumb]);
    return () => {
      setBreadCrumb((state) => state.slice(0, -2));
    };
  }, [setBreadCrumb]);

  const handleNotificationClick = (redirectUrl: string) => {
    // Redirect to the notification URL
    router.push(redirectUrl);
  };

  return (
    <section>
      <div className="max-w-full mt-6">
        <h2 className="text-xl font-semibold text-gray-900">Thông báo</h2>
        <div className="border-b border-gray-200 my-4"></div>
        <Card className="m-auto mt-3 w-full h-full">
          <CardHeader className="pb-[15px]">
            <CardTitle className="font-bold text-slate-500">Danh sách thông báo</CardTitle>
          </CardHeader>
          <CardContent className="text-12 flex flex-col gap-4 p-3">
            {notificationsList.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.redirect_url)} // Add onClick handler
                className={`px-2 rounded-lg	 border-b border-gray-200 py-4 flex justify-between items-start cursor-pointer ${notification.is_read ? 'bg-gray-100' : 'bg-[#cde8ff]'}`}
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
