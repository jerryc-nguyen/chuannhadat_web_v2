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
import React, { useEffect } from 'react';
import { isShowSessionTimout } from './session-timeout-atoms';
import { Separator } from '@components/ui/separator';
import { useAuth } from '@common/auth/AuthContext';
import { useIdleTimer } from 'react-idle-timer';
import { useRouter } from 'next/navigation';
import ModalSelectRegisterOrLogin from '@frontend/features/auth/mobile/ModalSelectRegisterOrLogin';
import useModals from '@frontend/features/layout/mobile-modals/hooks';

const SessionTimeOutPopup = () => {
  const [showSessionTimeout, setShowSessionTimeout] = useAtom(isShowSessionTimout);
  const { openModal, closeModal } = useModals();
  const router = useRouter();

  // Safely access the auth context
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated || false;
  const logout = auth?.logout || (() => console.warn('Logout function not available'));
  const checkAuthStatus = auth?.checkAuthStatus || (() => false);

  const handleCloseTimoutPopup = () => {
    setShowSessionTimeout(false);
    // Call logout from AuthContext
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

  // Use this function to check authentication status safely
  const checkAuth = () => {
    try {
      return checkAuthStatus();
    } catch (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
  };

  const onIdle = () => {
    // Only trigger timeout if the user was previously authenticated but token is gone
    const isStillLoggedIn = checkAuth();
    if (!isStillLoggedIn && isAuthenticated) {
      setShowSessionTimeout(true);
    }
  };

  const onActive = () => {
    console.log('Client come back');
  };

  const broadCastMessage = () => {
    try {
      const broadCastChannel = new BroadcastChannel('reloadChannel');
      broadCastChannel.postMessage({ type: 'loginAgain', value: true });
    } catch (error) {
      console.error('Error broadcasting message:', error);
    }
  };

  const onMessage = (event: any) => {
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

  // Maximum timeout value allowed (approximately 24.8 days)
  // Using 24 days to be safe (24 * 24 * 60 * 60 * 1000)
  const MAX_TIMEOUT_MS = 10 * 24 * 60 * 60 * 1000; // Maximum 32-bit integer value

  useIdleTimer({
    onIdle,
    onActive,
    onMessage,
    timeout: MAX_TIMEOUT_MS, // Using maximum safe value
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
