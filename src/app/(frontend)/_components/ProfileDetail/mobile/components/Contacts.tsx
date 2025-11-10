'use client';
import React from 'react';
import ButtonPhone from '@components/button-phone';
import { ZALO_ICON } from '@common/constants';
import { IUser } from '@common/types';

interface ContactsProps {
  profileData?: IUser;
}

const Contacts: React.FC<ContactsProps> = ({ profileData }) => {
  return (
    <div className="flex gap-3 items-center">
      {profileData?.phone && (
        <ButtonPhone
          isCall={true}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          phoneNumberProfile={profileData.phone}
        />
      )}
      <a
        href={`https://zalo.me/${profileData?.phone}`}
        target="_blank"
        className="inline-block transition-transform duration-200 hover:scale-110 hover:shadow-lg rounded-full"
      >
        <img src={ZALO_ICON} alt="Zalo" width={50} height={50} className="rounded-full" />
      </a>
    </div>
  );
};

export default Contacts;
