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
import { useAuth } from '@common/auth/AuthContext';
import { useIdleTimer } from 'react-idle-timer';
import { useRouter } from 'next/navigation';
import ModalSelectRegisterOrLogin from '@mobile/auth/ModalSelectRegisterOrLogin';
import useModals from '@mobile/modals/hooks';

const SessionTimeOutPopup = () => {
  const [showSessionTimeout, setShowSessionTimeout] = useAtom(isShowSessionTimout);
  const { openModal, closeModal } = useModals();
  const router = useRouter();
  const { isAuthenticated, logout, checkAuthStatus } = useAuth();

  const handleCloseTimoutPopup = () => {
    setShowSessionTimeout(false);
    // Call logout from AuthContext instead of manual token removal
    logout();
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
    // Check auth status using the context instead of direct cookie checks
    const isStillLoggedIn = checkAuthStatus();
    if (!isStillLoggedIn && isAuthenticated) {
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
