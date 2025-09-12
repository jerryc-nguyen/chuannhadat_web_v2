'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@common/utils';
import { Clock, ExternalLink, Mail, MailOpen } from 'lucide-react';
import { AxiosResponse } from 'axios';
import { IResponseData } from '@common/types/api';

interface NotificationItemProps {
  notification: {
    id: number;
    title: string;
    description: string;
    formatted_created_at: string;
    is_read: boolean;
    redirect_url: string;
  };
  onMarkAsRead: (id: number) => Promise<AxiosResponse<IResponseData<null>>>;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  const router = useRouter();

  const handleNotificationClick = async (redirectUrl: string) => {
    try {
      // Mark notification as read if it's not already read
      if (!notification.is_read) {
        const response = await onMarkAsRead(notification.id);
        // Check if the response has the expected structure
        if (!response.data?.status) {
          console.warn('Failed to mark notification as read');
        }
      }
      // Navigate to the redirect URL
      router.push(redirectUrl);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Still navigate even if marking as read fails
      router.push(redirectUrl);
    }
  };

  return (
    <div
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
  );
};

export default NotificationItem;
