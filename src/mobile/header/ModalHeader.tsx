'use client';
import useModals from '@mobile/modals/hooks';
import {
  Block,
  Button,
  Link,
  Navbar,
  Page,
  Panel,
} from 'konsta/react';
import React from 'react';
import ModalSelectRegisterOrLogin from '@mobile/auth/ModalSelectRegisterOrLogin';
import useAuth from '@mobile/auth/hooks/useAuth';

export default function ModalHeader({
  rightPanelOpened,
  setRightPanelOpened,
}: {
  rightPanelOpened: boolean;
  setRightPanelOpened: (value: boolean) => void;
}) {
  const { currentUser } = useAuth();
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
              <Link
                navbar
                onClick={() => setRightPanelOpened(false)}
              >
                Close
              </Link>
            }
          />
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
        </Page>
      </Panel>
    </>
  );
}
