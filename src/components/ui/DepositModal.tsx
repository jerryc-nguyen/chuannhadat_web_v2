import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';
import qrImage from '@assets/images/deposit_qr.png';
import Image from 'next/image';
import { BsCopy } from 'react-icons/bs';
import { HiOutlineClipboardDocumentCheck } from 'react-icons/hi2';
import { Be_Vietnam_Pro } from 'next/font/google';
import { useAtom } from 'jotai';
import {
  openModalDepositAtom,
  statusTransactionAtom,
} from '@desktop/dashboard/states/depositAtoms';
import { services } from '@api/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '@mobile/auth/hooks/useAuth';
import { PiSealCheckFill } from 'react-icons/pi';
import { useBalanceRequest } from '@api/balance';
import Confetti from 'react-confetti';
import { cn } from '@common/utils';

type DepositModalProps = object;
const vietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '700', '600', '500'],
});
const DepositModal: React.FC<DepositModalProps> = () => {
  const {
    isOpenDepositModal,
    setOpenDepositModal,
    statusTransaction,
    checkDepositMutate,
    setStatusTransaction,
  } = useDepositModal();
  const { currentUser } = useAuth();
  const [isCopied, setIsCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText('9021203567235');
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 4000);
  };
  React.useEffect(() => {
    let timmerId: NodeJS.Timeout;
    // Call Api check deposit interval when statusTransaction is false and isOpenDepositModal is true
    if (!statusTransaction && isOpenDepositModal) {
      timmerId = setInterval(() => {
        checkDepositMutate(currentUser?.last_deposit_id as number);
      }, 5000);
    }
    if (!isOpenDepositModal) {
      setStatusTransaction(false);
    }
    return () => {
      clearInterval(timmerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusTransaction, isOpenDepositModal]);
  const guideDeposit = () => (
    <>
      <AlertDialogDescription>
        <p> - Hiện tại chúng tôi chỉ hỗ trợ nạp tiền qua chuyển khoản ngân hàng.</p>
        <p>
          - Bạn vui lòng chuyển tiền với nội dùng <b className="text-primary_color">cnd15991</b>
        </p>
        <p>
          - Nếu bạn gặp khó khăn hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi qua số điện thoại{' '}
          <b className="text-primary_color">0966662192</b>
        </p>
      </AlertDialogDescription>
      <h3 className="py-3 text-center font-semibold">Nạp tiền với thông tin bên dưới</h3>
      <section className="flex h-fit flex-col items-center justify-between gap-5 md:flex-row">
        <section className="relative w-3/4 rounded-lg border px-3 py-1 shadow-md sm:w-1/2">
          <Image alt="qr code" src={qrImage} />
        </section>
        <section className="box-border flex h-full w-full flex-col items-start justify-start gap-y-2 rounded-lg border bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 p-5 text-left leading-6 shadow-md md:w-1/2">
          <div>
            <p className="font-semibold text-foreground">Tài khoản</p>
            <div className="flex items-center gap-x-2">
              <p>9021203567235</p>
              {isCopied ? (
                <HiOutlineClipboardDocumentCheck className="text-xl" />
              ) : (
                <BsCopy onClick={handleCopy} className="cursor-pointer text-sm" />
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold text-foreground">Ngân hàng</p>
            <p>Ngân hàng bản việt</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Tên tài khoản</p>
            <p>Nguyễn Văn Linh</p>
          </div>
        </section>
      </section>
    </>
  );
  const transactionSuccessful = () => (
    <section className="flex flex-col items-center gap-y-2">
      <div className="mb-2 flex items-center justify-center rounded-full bg-success_color/10 p-5">
        <PiSealCheckFill className="text-5xl text-success_color" />
      </div>
      <h3 className="text-lg font-semibold">Chuyển khoản thành công</h3>
      <p className="text-sm">Giao dịch thành công 150.000đ</p>
      <p className="text-sm">Tài khoản của bạn được cộng 400 xu</p>
      <p>
        Cảm ơn bạn đã sử dụng và ủng hộ <b>ChuanNhaDat</b>🤗🥰
      </p>
    </section>
  );
  return (
    <AlertDialog open={isOpenDepositModal} onOpenChange={setOpenDepositModal}>
      <AlertDialogContent className={cn(vietnam.className, 'overflow-hidden')}>
        <AlertDialogHeader className="relative z-10 mb-2">
          <AlertDialogTitle>
            {statusTransaction ? 'Thông báo giao dịch' : 'Hướng dẫn nạp tiền'}
          </AlertDialogTitle>
          {statusTransaction ? transactionSuccessful() : guideDeposit()}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Hoàn thành</AlertDialogAction>
        </AlertDialogFooter>
        <Confetti
          numberOfPieces={100}
          run={statusTransaction}
          width={512}
          height={300}
          recycle={true}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};
export const useDepositModal = () => {
  const [isOpenDepositModal, setOpenDepositModal] = useAtom(openModalDepositAtom);
  const [statusTransaction, setStatusTransaction] = useAtom(statusTransactionAtom);
  const { fetchBalance } = useBalanceRequest();
  const queryClient = useQueryClient();
  const onOpenModalDeposit = () => {
    setOpenDepositModal(true);
  };
  const onCloseModalDeposit = () => {
    setOpenDepositModal(false);
    setStatusTransaction(false);
  };
  const { mutate: checkDepositMutate } = useMutation({
    mutationKey: ['check-deposit_qr'],
    mutationFn: services.profiles.checkDeposit,
    onSuccess: async (data) => {
      if (data.status) {
        // Deposit success -> update statusTransaction to true, open modal congratulation and fetch balance
        // open modal congratulation  with case when user in page top-up
        setStatusTransaction(true);
        !isOpenDepositModal && setOpenDepositModal(true);
        queryClient.invalidateQueries({ queryKey: ['get-profile-me'] });
        await fetchBalance();
      }
    },
  });

  return {
    isOpenDepositModal,
    onOpenModalDeposit,
    onCloseModalDeposit,
    setOpenDepositModal,
    statusTransaction,
    setStatusTransaction,
    checkDepositMutate,
  };
};
export default DepositModal;
