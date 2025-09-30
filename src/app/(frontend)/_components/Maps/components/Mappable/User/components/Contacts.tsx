'use client';
import React from 'react';
import { MapPin, Phone, Calendar, Copy, Check } from 'lucide-react';
import { IUser } from '@common/types';
import { formatPhoneNumber } from '@common/stringHelpers';
import { useState } from 'react';

interface ContactsProps {
  profileData: IUser;
}

const Contacts: React.FC<ContactsProps> = ({ profileData }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = async () => {
    if (profileData.phone) {
      try {
        await navigator.clipboard.writeText(profileData.phone);
        setCopied(true);
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (err) {
        console.error('Failed to copy phone number:', err);
      }
    }
  };

  const contactItems = [
    {
      icon: MapPin,
      label: 'Địa chỉ',
      value: profileData.address || 'Chưa cập nhật địa chỉ',
      color: 'text-secondary',
      hoverColor: 'hover:bg-teal-50',
      showCopy: false,
    },
    {
      icon: Phone,
      label: 'Số điện thoại',
      value: formatPhoneNumber(profileData.phone) || 'Chưa cập nhật số điện thoại',
      color: 'text-secondary',
      hoverColor: 'hover:bg-teal-50',
      showCopy: true,
      onCopy: handleCopyPhone,
      isClickable: true,
    },
    {
      icon: Calendar,
      label: 'Ngày tham gia',
      value: profileData.formatted_joined_at || 'Chưa có thông tin',
      color: 'text-secondary',
      hoverColor: 'hover:bg-teal-50',
      showCopy: false,
    },
  ];

  return (
    <div className="px-4 py-2 pt-0">
      <div className="space-y-1">
        {contactItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              onClick={item.isClickable ? item.onCopy : undefined}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                ${item.isClickable ? 'cursor-pointer' : 'cursor-default'}
                ${item.hoverColor}
                hover:shadow-sm
                group
              `}
            >
              <div className="flex-shrink-0">
                <IconComponent
                  className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform duration-200`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-500 mb-0.5">
                  {item.label}
                </div>
                <div className="text-sm text-gray-900 font-medium truncate">
                  {item.value}
                </div>
              </div>

              {item.showCopy && item.onCopy && (
                <div className="flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onCopy?.();
                    }}
                    className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200 group/copy"
                    title={copied ? "Copied!" : "Copy phone number"}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600 transition-colors duration-200" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 group-hover/copy:text-teal-600 transition-colors duration-200" />
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Contacts;
