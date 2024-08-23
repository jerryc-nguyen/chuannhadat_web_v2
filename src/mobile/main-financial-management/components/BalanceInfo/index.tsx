import { useBalance } from '@api/balance';
import { IBalanceResponse } from '@mobile/main-financial-management/states';
import { Block, BlockTitle } from 'konsta/react';
import { FC, useEffect, useState } from 'react';

const BalanceInfo: FC<{ title: string }> = ({ title }) => {
  const { fetchBalance } = useBalance();

  const [balanceData, setBalanceData] =
    useState<IBalanceResponse>({
      tk_chinh: '0 Xu',
      tk_km: '0 Xu',
      total: '0 Xu',
    });

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const result = await fetchBalance();
        setBalanceData(result.data);
      } catch (error) {
        console.error('Error loading balance', error);
      }
    };

    loadBalance();
  }, [fetchBalance]);

  return (
    <div className="c-balanceInfo">
      <BlockTitle large>{title}</BlockTitle>
      <Block strong inset outline className="c-cardBalance">
        <p className="uppercase">Số dư tài khoản</p>
        <h2 className="">{balanceData.total}</h2>
      </Block>
      <Block strong inset outline className="c-cardBalance">
        <p className="uppercase">Tài khoản chính</p>
        <h2 className="text-[#007bff]">
          {balanceData.tk_chinh}
        </h2>
      </Block>
      <Block
        strong
        inset
        outline
        className="c-cardBalance c-cardSales"
      >
        <p className="uppercase">Tài khoản khuyến mãi</p>
        <h2 className="text-[#fd7e14]">
          {balanceData.tk_km}
        </h2>
      </Block>
    </div>
  );
};

export default BalanceInfo;
