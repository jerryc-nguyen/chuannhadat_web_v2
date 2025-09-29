'use client';
import { useAuth } from '@common/auth/AuthContext';
import { DepositModal } from '@dashboard/features/payments';
import { AmountPicker } from '../components/AmountPicker';
import { TopUpNotes } from '../components/TopUpNotes';
import { TopUpTableMobile } from './TopUpTable';
import { useTopUpBreadcrumb } from '@dashboard/FinancialManagement/hooks';
import MobileContainer from '../../components/MobileContainer';

const TopUpMobile = () => {
  const { bankTransferNote } = useAuth();

  // Initialize hooks
  useTopUpBreadcrumb();

  return (
    <>
      <MobileContainer>
        <div className="space-y-4">
          <AmountPicker />
          <TopUpNotes bankTransferNote={bankTransferNote} />
          <TopUpTableMobile bankTransferNote={bankTransferNote} />
        </div>
      </MobileContainer>
      <DepositModal />
    </>
  );
};

export default TopUpMobile;
