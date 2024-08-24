'use client';
import useModals from '@mobile/modals/hooks';
import {
  Block,
  Button,
  Link as KLink,
  Navbar,
  Page,
  Panel,
} from 'konsta/react';
import React from 'react';
import ModalSelectRegisterOrLogin from '@mobile/auth/ModalSelectRegisterOrLogin';
import useAuth from '@mobile/auth/hooks/useAuth';
import Link from 'next/link';

export default function ModalHeader({
  rightPanelOpened,
  setRightPanelOpened,
}: {
  rightPanelOpened: boolean;
  setRightPanelOpened: (value: boolean) => void;
}) {
  const { currentUser, signout } = useAuth();
  const { openModal, closeModal } = useModals();

  const handleShowModalLoginAndRegister = () => {
    setRightPanelOpened(false);
    openModal({
      name: 'loginAndRegister',
      content: (
        <ModalSelectRegisterOrLogin onClose={closeModal} />
      ),
      title: 'Đăng nhập / Đăng ký',
      maxHeightPercent: 0.9,
    });
  };
  const title = currentUser
    ? `Xin chào, ${currentUser.full_name}`
    : 'Xin Chào, quý khách';

  return (
    <>
      <Panel
        side="right"
        opened={rightPanelOpened}
        onBackdropClick={() => setRightPanelOpened(false)}
      >
        <Page>
          <Navbar
            centerTitle={false}
            title={title}
            right={
              <KLink
                navbar
                onClick={() => setRightPanelOpened(false)}
              >
                Close
              </KLink>
            }
          />
          {!currentUser && (
            <Block className="flex flex-col gap-4">
              <Button
                className="h-12"
                onClick={() =>
                  handleShowModalLoginAndRegister()
                }
              >
                Đăng nhập/Đăng ký
              </Button>
            </Block>
          )}

          {currentUser && (
            <Block className="flex flex-col gap-4">
              <Link href="/dashboard">
                <Button className="h-12">
                  Trang quản lý
                </Button>
              </Link>
            </Block>
          )}

          {currentUser && (
            <Block className="flex flex-col gap-4">
              <Button
                className="h-12"
                onClick={() => signout()}
              >
                Đăng xuất
              </Button>
            </Block>
          )}
        </Page>
      </Panel>
    </>
  );
}
