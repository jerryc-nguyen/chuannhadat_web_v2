import useBalance from '@mobile/main-financial-management/hooks';
import { IBalanceResponse } from '@mobile/main-financial-management/types';
import { Block, BlockTitle } from 'konsta/react';
import { FC, useEffect, useState } from 'react';

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
      <BlockTitle large>{title}</BlockTitle>
      <div className="c-balanceInfo__cards flex">
        <Block strong inset outline className="c-cardBalance">
          <p className="uppercase">Số dư tài khoản</p>
          <h2 className="">{balanceData.total}</h2>
        </Block>
        <Block strong inset outline className="c-cardBalance">
          <p className="uppercase">Tài khoản chính</p>
          <h2 className="text-[#007bff]">{balanceData.tk_chinh}</h2>
        </Block>
        <Block strong inset outline className="c-cardBalance c-cardSales">
          <p className="uppercase">Tài khoản khuyến mãi</p>
          <h2 className="text-[#fd7e14]">{balanceData.tk_km}</h2>
        </Block>
      </div>
    </div>
  );
};

export default BalanceInfo;
