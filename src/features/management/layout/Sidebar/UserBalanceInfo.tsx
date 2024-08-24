'use client';

import { Button } from '@components/ui/button';
import { Card } from 'konsta/react';

export const UserBalanceInfo = () => {
  return (
    <div>
      <div className="flex flex-col items-center gap-3">
        <div className="h-18 w-18 rounded-full bg-gray-300 text-center"></div>
        <div className="text-lg font-semibold">Tester</div>
      </div>

      <Card className="border">
        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-2 uppercase text-gray-400">Tài khoản chính</div>
            <div className="text-xl font-semibold text-blue-600">0 Xu</div>
          </div>

          <div>
            <div className="mb-2 uppercase text-gray-400">Tài khoản KM</div>
            <div className="text-xl font-semibold text-orange-500">30,000 Xu</div>
          </div>

          <Button variant={'outline'} className="border-blue-500 text-blue-500">
            <div className="font-semibold">Nạp tiền</div>
          </Button>
        </div>
      </Card>
    </div>
  );
};
