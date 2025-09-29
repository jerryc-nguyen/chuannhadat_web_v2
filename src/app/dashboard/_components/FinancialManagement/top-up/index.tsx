'use client';
import { useAuth } from '@common/auth/AuthContext';
import { useApp } from '@common/context/AppContext';
import { DepositModal } from '@dashboard/features/payments';
import '@styles/pages/desktop/finacial-management/top-up.scss';
import { AmountPicker } from './components/AmountPicker';
import { TopUpNotes } from './components/TopUpNotes';
import { TopUpTable } from './components/TopUpTable';
import { useTopUpBreadcrumb } from '@dashboard/FinancialManagement/hooks';
import TopUpMobile from './mobile';

const TopUpView = () => {
  const { bankTransferNote } = useAuth();
  const { isMobile } = useApp();

  // Initialize hooks
  useTopUpBreadcrumb();

  if (isMobile) {
    return <TopUpMobile />;
  }

  return (
    <>
      <div className="mx-4">
        <div className="c-top-up__content">
          <AmountPicker />
          <TopUpNotes bankTransferNote={bankTransferNote} />
          <TopUpTable bankTransferNote={bankTransferNote} />
        </div>
      </div>
      <DepositModal />
    </>
  );
};

export default TopUpView;
