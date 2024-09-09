import React, { useState } from 'react';
import { Navbar, Searchbar } from 'konsta/react';

import RightItem from './RightItem';
import ModalHeader from './ModalHeader';
import ModalNotifyHeader from './ModalNotifyHeader';
import Link from 'next/link';
import { usePaginatedNotifications } from '@mobile/notification/hooks';
import useAuth from '@mobile/auth/hooks/useAuth';

export default function MainNav({
  type,
  onSearchClick = () => undefined,
  isShowSearch = true,
}: {
  type: string | null;
  onSearchClick?: () => void;
  isShowSearch?: boolean;
}) {
  const [rightPanelOpened, setRightPanelOpened] = useState(false);
  const [notifyPanelOpened, setNotifyPanelOpened] = useState(false);

  const utilClass = type == 'SearchInSub' ? 'isSearchSub' : '';

  const LeftItems = () => {
    return (
      <Link href="/">
        <img src="https://chuannhadat.com/images/logo_mobile@2x.png" width="40" />
      </Link>
    );
  };

  const { loadMore } = usePaginatedNotifications();
  const {  currentUser } = useAuth();

  React.useEffect(() => {
    loadMore();
  }, [currentUser]);

  return (
    <>
      <Navbar
        innerClassName={`c-mainNav ${utilClass}`}
        leftClassName={'c-mainNav__left'}
        titleClassName={'c-mainNav__title'}
        rightClassName={'c-mainNav__right'}
        left={<LeftItems />}
        right={<RightItem setRightPanelOpened={setRightPanelOpened} setNotifyPanelOpened={setNotifyPanelOpened}/>}
        subnavbarClassName={`c-mainNav__sub ${utilClass}`}
        subnavbar={
          isShowSearch && (
            <div style={{ display: 'block', width: '100%' }}>
              <Searchbar inputStyle={{ borderRadius: '30px' }} />
              <div className="c-mainNav__mask" onClick={() => onSearchClick()}></div>
            </div>
          )
        }
      />
      <ModalHeader rightPanelOpened={rightPanelOpened} setRightPanelOpened={setRightPanelOpened} />
      <ModalNotifyHeader notifyPanelOpened={notifyPanelOpened} setNotifyPanelOpened={setNotifyPanelOpened} />
    </>
  );
}
