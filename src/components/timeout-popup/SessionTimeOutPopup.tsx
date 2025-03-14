'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@components/ui/alert-dialog';
import { useAtom } from 'jotai';
import React from 'react';
import { isShowSessionTimout } from './session-timeout-atoms';
import { Separator } from '@components/ui/separator';
import useAuth from '@mobile/auth/hooks/useAuth';
import { getTokenClient } from '@common/cookies';
import { useIdleTimer } from 'react-idle-timer';
import { useRouter } from 'next/navigation';
import { timeOutDuration } from '@common/constants';
import ModalSelectRegisterOrLogin from '@mobile/auth/ModalSelectRegisterOrLogin';
import useModals from '@mobile/modals/hooks';
import { checkIsLoggedInServer } from '@app/action';

type SessionTimeOutPopupProps = {
  isLogged: boolean;
};
const SessionTimeOutPopup: React.FC<SessionTimeOutPopupProps> = ({ isLogged }) => {
  const [showSessionTimeout, setShowSessionTimeout] = useAtom(isShowSessionTimout);
  const { openModal, closeModal } = useModals();
  const router = useRouter();
  const tokenCookie = getTokenClient();
  const { handleSignOut, currentUser } = useAuth();

  const handleCloseTimoutPopup = () => {
    setShowSessionTimeout(false);
    // Remove server-side token call - we're using client-side only
    // removeTokenServer();
    router.refresh();
    broadCastMessage();
    openModal({
      name: 'loginAndRegister',
      content: <ModalSelectRegisterOrLogin onClose={closeModal} />,
      title: 'Đăng nhập / Đăng ký',
      maxHeightPercent: 0.9,
      showAsDialog: true,
      btsContentWrapClass: 'mt-2 bg-white p-4',
    });
  };

  const onIdle = () => {
    if (currentUser && !tokenCookie) {
      setShowSessionTimeout(true);
    }
  };
  const onActive = () => {
    console.log('Client come back');
  };
  const broadCastMessage = () => {
    const broadCastChannel = new BroadcastChannel('reloadChannel');
    broadCastChannel.postMessage({ type: 'loginAgain', value: true });
  };
  const onMessage = (event: A) => {
    if (event.data && event.data.type === 'loginAgain' && event.data.value) {
      setShowSessionTimeout(false);
      openModal({
        name: 'loginAndRegister',
        content: <ModalSelectRegisterOrLogin onClose={closeModal} />,
        title: 'Đăng nhập / Đăng ký',
        maxHeightPercent: 0.9,
        showAsDialog: true,
        btsContentWrapClass: 'mt-2 bg-white p-4',
      });
    }
  };
  // 30 days in milliseconds
  const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

  useIdleTimer({
    onIdle,
    onActive,
    onMessage,
    timeout: THIRTY_DAYS_IN_MS,
    crossTab: true,
    throttle: 500,
  });
  React.useEffect(() => {
    if (!isLogged) {
      handleSignOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged]);
  return (
    <AlertDialog open={showSessionTimeout}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> Thông báo</AlertDialogTitle>
          <Separator className="my-2" />
          <AlertDialogDescription className="text-sm text-black">
            Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="bg-primary_color/80 hover:bg-primary_color"
            onClick={handleCloseTimoutPopup}
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionTimeOutPopup;
