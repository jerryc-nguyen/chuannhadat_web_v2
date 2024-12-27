import useBalance from '@mobile/main-financial-management/hooks';
import { IBalanceResponse } from '@mobile/main-financial-management/types';
import { FC, useEffect, useState } from 'react';
import { CND_TEXT_COLORS } from '@common/constants';
import FigureCard, { CardIcons } from '@desktop/dashboard/components/FigureCard';

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
      <h3 className="mb-4 text-xl font-bold">{title}</h3>

      <div className="mb-4 grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <FigureCard
          title="Số dư tài khoản"
          contentClassName={CND_TEXT_COLORS.Success}
          content={balanceData.total}
          icon={CardIcons.Money}
        />

        <FigureCard title="Tài khoản chính" content={balanceData.tk_chinh} icon={CardIcons.Money} />

        <FigureCard
          title="Tài khoản khuyến mãi"
          content={balanceData.tk_km}
          icon={CardIcons.Money}
        />
      </div>
    </div>
  );
};

export default BalanceInfo;
