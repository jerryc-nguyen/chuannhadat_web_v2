import { FC, useEffect, useState } from 'react';
import useBalance from '@mobile/main-financial-management/hooks';
import { IBalanceResponse } from '@mobile/main-financial-management/types';

import { MdOutlineDiscount } from 'react-icons/md';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { IoWalletOutline } from 'react-icons/io5';
import { LuInfo } from 'react-icons/lu';

import { Card, CardContent } from '@components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';

const BalanceInfo: FC = () => {
  const { balanceInfo } = useBalance();

  const [balanceData, setBalanceData] = useState<IBalanceResponse>({
    tk_chinh: '0 Xu',
    tk_km: '0 Xu',
    total: '0 Xu',
  });

  useEffect(() => {
    balanceInfo && setBalanceData(balanceInfo);
  }, [balanceInfo]);

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 flex justify-between text-16">
            <span className="flex items-center gap-2">
              Tài khoản chính{' '}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <LuInfo className="text-16" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>1 Xu tương đương 1 VNĐ.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <FaRegMoneyBillAlt className="text-32" />
          </h3>
          <h1 className="text-36 font-bold">{balanceData?.tk_chinh}</h1>
        </CardContent>
      </Card>
      <div className="mt-3 flex gap-4">
        <Card className="h-full w-full min-w-[45%] flex-1">
          <CardContent className="flex h-full items-center gap-4 p-3 text-12">
            <IoWalletOutline className="text-20" />
            <div>
              <h3>Số dư tài khoản</h3>
              <h1 className="text-18 font-medium">{balanceData?.total}</h1>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="flex h-full items-center gap-4 p-3 text-12">
            <MdOutlineDiscount className="text-20" />
            <div>
              <h3>Tài khoản khuyến mãi</h3>
              <h1 className="text-18 font-medium text-[#fd7e14]">{balanceData?.tk_km}</h1>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BalanceInfo;
