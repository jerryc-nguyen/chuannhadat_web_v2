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
import React, { useState } from 'react';
import ModalSelectRegisterOrLogin from './ModalSelectRegisterOrLogin';

export default function ModalHeader({
  rightPanelOpened,
  setRightPanelOpened,
}: {
  rightPanelOpened: boolean;
  setRightPanelOpened: (value: boolean) => void;
}) {
  const { openModal } = useModals();

  const handleShowModalLoginAndRegister = () => {
    setRightPanelOpened(false);
    openModal({
      name: 'loginAndRegister',
      content: <ModalSelectRegisterOrLogin />,
      title: 'Đăng nhập/Đăng ký',
    });
  };
  return (
    <>
      <Panel
        side="right"
        opened={rightPanelOpened}
        onBackdropClick={() => setRightPanelOpened(false)}
      >
        <Page>
          <Navbar
            title="Xin Chào, quý khách"
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
