'use client';
import { useAuth } from '@common/auth/AuthContext';
import { useApp } from '@common/context/AppContext';
import { DepositModal } from '@dashboard/features/payments';
import '@styles/pages/desktop/finacial-management/top-up.scss';
import { AmountPicker } from './components/AmountPicker';
import { TopUpNotes } from './components/TopUpNotes';
import { TopUpTable } from './components/TopUpTable';
import { useTopUpBreadcrumb } from '@dashboard/FinancialManagement/hooks';
import MobileContainer from '../components/MobileContainer';

const TopUpView = () => {
  const { bankTransferNote } = useAuth();
  const { isMobile } = useApp();

  // Initialize hooks
  useTopUpBreadcrumb();

  const content = (
    <div className={isMobile ? "space-y-4" : "c-top-up__content"}>
      <AmountPicker />
      <TopUpNotes bankTransferNote={bankTransferNote} />
      <TopUpTable bankTransferNote={bankTransferNote} />
    </div>
  );

  return (
    <>
      {isMobile ? (
        <MobileContainer>
          {content}
        </MobileContainer>
      ) : (
        <div className="mx-4">
          {content}
        </div>
      )}
      <DepositModal />
    </>
  );
};

export default TopUpView;
