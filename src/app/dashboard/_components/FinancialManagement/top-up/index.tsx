'use client';
import { useAuth } from '@common/auth/AuthContext';
import { DepositModal } from '@dashboard/features/payments';
import '@styles/pages/desktop/finacial-management/top-up.scss';
import { AmountPicker } from './components/AmountPicker';
import { TopUpNotes } from './components/TopUpNotes';
import { TopUpTable } from './components/TopUpTable';
import { useTopUpBreadcrumb } from './hooks/useTopUpBreadcrumb';
import { useTopUpPolling } from './hooks/useTopUpPolling';

const TopUpView = () => {
  const { bankTransferNote } = useAuth();

  // Initialize hooks
  useTopUpPolling();
  useTopUpBreadcrumb();

  return (
    <div className="mx-4">
      <AmountPicker />

      <div className="c-top-up__content">
        <TopUpNotes bankTransferNote={bankTransferNote} />

        <TopUpTable bankTransferNote={bankTransferNote} />
      </div>

      <DepositModal />
    </div>
  );
};

export default TopUpView;
