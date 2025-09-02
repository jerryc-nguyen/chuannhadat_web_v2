import useBalance from '@mobile/main-financial-management/hooks';
import { IBalanceResponse } from '@mobile/main-financial-management/types';
import { FC, useEffect, useState } from 'react';

import { Info } from 'lucide-react';

import { Card, CardContent } from '@components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';

const BalanceInfo: FC = () => {
  const { balanceInfo } = useBalance();

  const [balanceData, setBalanceData] = useState<IBalanceResponse>({
    tk_chinh: '0 Xu',
    tk_km: '0 Xu',
    total: '0 Xu',
    total_amount: 0,
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
                    <Info className="text-16" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>1 Xu tương đương 1 VNĐ.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          </h3>
          <h1 className="text-36 font-bold">{balanceData?.tk_chinh}</h1>
        </CardContent>
      </Card>
      <div className="mt-3 flex gap-4">
        <Card className="h-full w-full min-w-[45%] flex-1">
          <CardContent className="flex h-full items-center gap-4 p-3 text-12">
            <div>
              <h3>Số dư</h3>
              <h1 className="text-18 font-medium">{balanceData?.total}</h1>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="flex h-full items-center gap-4 p-3 text-12">
            <div>
              <h3>Khuyến mãi</h3>
              <h1 className="text-18 font-medium text-[#fd7e14]">{balanceData?.tk_km}</h1>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BalanceInfo;
