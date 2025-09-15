'use client';
import React from 'react';
import { CircleCheck } from 'lucide-react';

interface ReceivedResetSmsProps {
  resetPhone: string;
}

const ReceivedResetSms: React.FC<ReceivedResetSmsProps> = ({ resetPhone }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-3">
      <CircleCheck className="text-5xl text-success_color" size={50} />
      <p>
        Tài khoản với SĐT <b className="text-primary_color">{resetPhone}</b> đã được cấp lại mật khẩu mới: <b className="text-xl">123456</b>,
        vui lòng đăng nhập và thay đổi mật khẩu của bạn tại:
        <br />
        <b>Cài đặt tài khoản</b> / <b>Mật khẩu</b>
      </p>
    </div>
  );
};

export default ReceivedResetSms;
