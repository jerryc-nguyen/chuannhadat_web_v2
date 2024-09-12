'use client';
import useModals from '@mobile/modals/hooks';
import React from 'react';
import ModalSelectRegisterOrLogin from '@mobile/auth/ModalSelectRegisterOrLogin';
import useAuth from '@mobile/auth/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@components/ui/button';
import useSidePanels from '@components/SidePanel/hooks';

export default function MainNavSidePanel() {
  const { currentUser, signout } = useAuth();
  const { openModal, closeModal } = useModals();
  const { closePanel } = useSidePanels();

  const handleShowModalLoginAndRegister = () => {
    closePanel();
    openModal({
      name: 'loginAndRegister',
      content: <ModalSelectRegisterOrLogin onClose={closeModal} />,
      title: 'Đăng nhập / Đăng ký',
      maxHeightPercent: 0.9,
    });
  };

  const title = currentUser ? `Xin chào, ${currentUser.full_name}` : 'Xin Chào, quý khách';

  return (
    <>
      {!currentUser && (
        <div className="flex flex-col gap-4">
          <Button className="h-12" onClick={() => handleShowModalLoginAndRegister()}>
            Đăng nhập/Đăng ký
          </Button>
        </div>
      )}

      {currentUser && (
        <div className="flex flex-col gap-4">
          <Link href="/dashboard">
            <Button className="h-12">Trang quản lý</Button>
          </Link>
        </div>
      )}

      {currentUser && (
        <div className="flex flex-col gap-4">
          <Button className="h-12" onClick={() => signout()}>
            Đăng xuất
          </Button>
        </div>
      )}
    </>
  );
}
