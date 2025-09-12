'use client';
import {
  breadcrumbAtom,
  defaultBreadcrumb,
  IBreadcrumbItem,
} from '@dashboard/DashboardLayout/states/breadcrumbAtom';
import { useSetAtom } from 'jotai';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { usePaginatedNotifications } from './hooks/usePaginatedNotifications';
import { Bell, Clock, ExternalLink, Mail, MailOpen } from 'lucide-react';
import { cn } from '@common/utils';

const NotificationsDesktop: React.FC = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNotificationClick = (redirectUrl: string) => {
    // Redirect to the notification URL
    router.push(redirectUrl);
  };

  return (
    <section className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <Bell className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Thông báo</h1>
        </div>
        {notificationsList.length > 0 && (
          <Badge variant="secondary" className="text-xs md:text-sm text-white">
            {notificationsList.filter(n => !n.is_read).length} chưa đọc
          </Badge>
        )}
      </div>

      {/* Notifications List */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          {notificationsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center px-4">
              <Bell className="h-10 w-10 md:h-12 md:w-12 text-gray-300 mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
              <p className="text-sm md:text-base text-gray-500">Bạn sẽ nhận được thông báo khi có cập nhật mới.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notificationsList.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.redirect_url)}
                  className={cn(
                    "group relative flex items-start gap-3 md:gap-4 p-4 md:p-6 transition-all duration-200 cursor-pointer border-l-4 hover:shadow-md hover:bg-white min-h-[80px] active:bg-gray-50",
                    notification.is_read
                      ? "border-l-gray-200 bg-white hover:border-l-gray-300"
                      : "border-l-blue-500 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 hover:to-blue-50"
                  )}
                >
                  {/* Notification Icon */}
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center",
                    notification.is_read
                      ? "bg-gray-100 text-gray-500"
                      : "bg-blue-100 text-blue-600"
                  )}>
                    {notification.is_read ? (
                      <MailOpen className="h-4 w-4 md:h-5 md:w-5" />
                    ) : (
                      <Mail className="h-4 w-4 md:h-5 md:w-5" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 md:gap-3">
                      <h4 className={cn(
                        "text-sm md:text-base leading-5 md:leading-6 mb-1 md:mb-2 pr-2",
                        notification.is_read
                          ? "text-gray-800 font-medium"
                          : "text-gray-900 font-semibold"
                      )}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                        {!notification.is_read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        )}
                        <ExternalLink className="h-3 w-3 md:h-4 md:w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    <p className={cn(
                      "text-xs md:text-sm leading-relaxed mb-2 md:mb-3",
                      notification.is_read
                        ? "text-gray-600"
                        : "text-gray-700"
                    )}>
                      {notification.description}
                    </p>

                    <div className="flex items-center gap-1 md:gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <time className="font-medium truncate">{notification.formatted_created_at}</time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default NotificationsDesktop;
