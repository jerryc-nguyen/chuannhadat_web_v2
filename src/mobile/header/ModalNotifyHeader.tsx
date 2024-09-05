'use client';
import { Navbar, Page, Panel } from 'konsta/react';
import React from 'react';
import { usePaginatedNotifications } from '@mobile/notification/hooks';
import NotificationsList from '@mobile/notification/NotificationsList';
import { Switch } from '@components/ui/switch';
import { Label } from '@components/ui/label';
import { useNotificationRequest } from '@api/notification';
import { useRouter } from 'next/navigation';

export default function ModalNotifyHeader({
  notifyPanelOpened,
  setNotifyPanelOpened,
}: {
  notifyPanelOpened: boolean;
  setNotifyPanelOpened: (value: boolean) => void;
}) {
  
  const { total, notifications, loadMore, onFilter } = usePaginatedNotifications();
  const { makeMarkRead } = useNotificationRequest();

  const router = useRouter()

  const handleRedirect = async (id: number, is_read: boolean) => {
    !is_read && await makeMarkRead(id) 
    router.push(notifications.find(notify => notify.id === id)?.redirect_url as string)
  };

  const [isReaded, setReaded] = React.useState<boolean>(false);
  const handleChangeStatus = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | EventTarget>,
  ) => {
    event.stopPropagation();
    setReaded(!isReaded);
    !isReaded ? onFilter('unread') : onFilter(null);
  };
  return (
    <>
      <Panel
        side="right"
        opened={notifyPanelOpened}
        onBackdropClick={() => setNotifyPanelOpened(false)}
      >
        <Page>
          <Navbar
            centerTitle={false}
            title={'Thông báo'}
            right={
              <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" checked={isReaded} onClick={handleChangeStatus} />
                <Label htmlFor="airplane-mode">Chưa đọc</Label>
              </div>
            }
          />
          <NotificationsList
            notifications={notifications}
            total={total}
            onLoadMore={loadMore}
            onRedirect={handleRedirect}
          />
        </Page>
      </Panel>
    </>
  );
}
