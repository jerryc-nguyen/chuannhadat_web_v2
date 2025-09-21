export interface DepositModalProps { }

export interface GuideDepositProps {
  bankTransferNote: string;
  isCopied: boolean;
  onCopy: () => void;
}

export interface TransactionSuccessfulProps {
  formattedAmount: string | undefined;
}

export interface UseDepositModalReturn {
  isOpenDepositModal: boolean;
  onOpenModalDeposit: () => void;
  onCloseModalDeposit: () => void;
  setOpenDepositModal: (open: boolean) => void;
  statusTransaction: boolean;
  setStatusTransaction: (status: boolean) => void;
  checkDepositMutate: (id: number) => void;
  formattedAmount: string | undefined;
}
