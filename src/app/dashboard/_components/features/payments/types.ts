export interface GuideDepositProps {
  bankTransferNote: string;
  isCopied: boolean;
  onCopy: () => void;
  selectedAmount: number | null;
  onAmountSelect: (amount: number) => void;
}

export interface TransactionSuccessfulProps {
  formattedAmount: string | undefined;
}

export interface UseDepositModalReturn {
  isOpenDepositModal: boolean;
  onOpenModalDeposit: (isResetAmount?: boolean) => void;
  onCloseModalDeposit: () => void;
  setOpenDepositModal: (open: boolean) => void;
  statusTransaction: boolean;
  setStatusTransaction: (status: boolean) => void;
  checkDepositMutate: (id: number) => void;
  formattedAmount: string | undefined;
  selectedAmount: number | null;
  handleAmountSelect: (amount: number) => void;
  clearAmount: () => void;
}
