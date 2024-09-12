import useBalance from '@mobile/main-financial-management/hooks';
import { IBalanceResponse } from '@mobile/main-financial-management/types';
import { FC, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BalanceInfo: FC<{ title: string }> = ({ title }) => {
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
    <div className="c-balanceInfo">
      <h3 className="my-4 text-xl font-bold">{title}</h3>

      <div className="flex gap-4">
        <Card className="flex-1">
          <CardHeader className="mt-4 p-4 pb-0">
            <CardTitle className="uppercase text-slate-400">Số dư tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-xl text-[#007bff]">{balanceData.total}</CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="mt-4 p-4 pb-0">
            <CardTitle className="uppercase text-slate-400">Tài khoản chính</CardTitle>
          </CardHeader>
          <CardContent className="gap-4 p-4 text-xl text-[#007bff]">
            {balanceData.tk_chinh}
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="mt-4 p-4 pb-0">
            <CardTitle className="uppercase text-slate-400">Tài khoản khuyến mãi</CardTitle>
          </CardHeader>
          <CardContent className="gap-4 p-4 text-xl text-[#fd7e14]">
            {balanceData.tk_km}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BalanceInfo;
