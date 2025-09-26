import { CND_TEXT_COLORS } from '@common/constants';
import useBalance from '@dashboard/FinancialManagement/hooks';
import FigureCard, { CardIcons } from '@dashboard/DashboardLayout/components/FigureCard';
import { FC } from 'react';

const BalanceInfo: FC<{ title: string }> = ({ title }) => {
  const { balanceData } = useBalance(); // ✅ Simplified - no more complex state management

  return (
    <div className="c-balanceInfo">
      <h3 className="mb-4 text-2xl font-bold">{title}</h3>

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
