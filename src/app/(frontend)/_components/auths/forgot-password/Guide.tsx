'use client';
import React from 'react';
import { Copy } from 'lucide-react';
import { SMS_PHONE_NUMBER } from '@common/constants';
import { toast } from 'sonner';
import { IVerifyPhoneResponseData } from '../../auths/types';

interface GuideProps {
  account: IVerifyPhoneResponseData;
  onCopy: (text: string) => void;
}

const Guide: React.FC<GuideProps> = ({ account, onCopy }) => {
  return (
    <div className="flex flex-col justify-center gap-y-3">
      <div>
        <p>
          Xin chào <b className="font-medium text-primary_color">{account.name}</b>, để
          reset lại mật khẩu, bạn có thể làm theo cách sau:

          <div className="relative my-4 mt-8">
            <hr className="border-gray-300" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-500">
              Cách 1
            </span>
          </div>

          Soạn tin nhắn theo cú pháp :
          <b className="text-primary_color/80"> reset</b> gửi đến{' '}
          <span className="inline-flex items-center gap-1">
            <b className="text-primary_color/80">{SMS_PHONE_NUMBER}</b>
            <Copy
              className="h-4 w-4 cursor-pointer text-primary_color/60 hover:text-primary_color transition-colors"
              onClick={() => {
                onCopy(SMS_PHONE_NUMBER);
                toast.success('Đã sao chép số điện thoại');
              }}
            />
          </span>
        </p>

        {/* Separator for alternative option */}
        <div className="relative my-4 mt-10">
          <hr className="border-gray-300" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-500">
            Cách 2
          </span>
        </div>

        {(account.email) && (
          <div>
            <p className="text-sm text-gray-600">
              Reset mật khẩu bằng email: <b className="text-primary_color/80">{account.email}</b>
            </p>
            <button className="bg-primary_color text-white px-4 py-2 rounded-md mt-2">Gửi link reset mật khẩu qua email</button>
          </div>
        )}

        <div className="relative my-4 mt-10 italic">
          Ghi chú: Sau 1-2 phút gửi SMS mà mật khẩu chưa được reset, có thể hệ thống nhận SMS có vấn đề.
          <br />
          {(account.email) && (
            <>Bạn vui lòng sử dụng
              <b> cách 2: nhận link reset qua email</b> hoặc liên hệ cho chúng tôi qua Facebook.
            </>
          )}
          {(!account.email) && ('Bạn vui lòng liên hệ cho chúng tôi qua Facebook.')}
        </div>

      </div>
    </div >
  );
};

export default Guide;
