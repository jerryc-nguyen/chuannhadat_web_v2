'use client';

import { useAuth } from '@common/auth/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import useModals from '@mobile/modals/hooks';
import ModalSelectRegisterOrLogin from '@mobile/auth/ModalSelectRegisterOrLogin';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || '/';
  const { openModal, closeModal } = useModals();

  useEffect(() => {
    // Verify current auth status
    const authStatus = checkAuthStatus();

    if (!authStatus) {
      // Store the current URL to redirect back after login
      try {
        sessionStorage.setItem('redirectAfterLogin', pathname);
      } catch (e) {
        console.error('Error saving redirect path:', e);
      }

      // Show login modal rather than redirecting
      openModal({
        name: 'loginAndRegister',
        content: <ModalSelectRegisterOrLogin onClose={closeModal} />,
        title: 'Đăng nhập / Đăng ký',
        maxHeightPercent: 0.9,
        showAsDialog: true,
        btsContentWrapClass: 'mt-2 bg-white p-4',
      });

      // Optional: redirect instead of showing modal
      // router.push('/login');
    }
  }, [isAuthenticated, router, pathname, openModal, closeModal, checkAuthStatus]);

  // If authenticated, render the children
  // If not authenticated, we've already triggered the login modal or redirect
  return <>{children}</>;
};

export default ProtectedRoute; 
