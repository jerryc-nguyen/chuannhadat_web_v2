import React from 'react';
import { Navbar, Searchbar, Icon } from 'konsta/react';

import {
  IoMenuOutline,
  IoHeartOutline,
  IoNotificationsOutline,
} from 'react-icons/io5';

export default function MainNav({
  type,
  onSearchClick = () => null,
  isShowSearch = true,
}: {
  type: string | null;
  onSearchClick?: IFunction;
  isShowSearch?: boolean;
}) {
  const utilClass =
    type == 'SearchInSub' ? 'isSearchSub' : '';

  const LeftItems = () => {
    return (
      <img
        src="https://chuannhadat.com/images/logo_mobile@2x.png"
        width="40"
      />
    );
  };

  const RightItems = () => {
    return (
      <>
        <span className="mr-2 flex items-center justify-center rounded-full border p-2">
          <Icon
            ios={
              <IoNotificationsOutline className="h-5 w-5" />
            }
            badgeColors={{ bg: 'bg-red-500' }}
          />
        </span>
        <span className="mr-2 flex items-center justify-center rounded-full border p-2">
          <Icon
            ios={<IoHeartOutline className="h-5 w-5" />}
            badgeColors={{ bg: 'bg-red-500' }}
          />
        </span>
        <span className="mr-2 flex items-center justify-center rounded-full border p-2">
          <Icon
            ios={<IoMenuOutline className="h-5 w-5" />}
            badgeColors={{ bg: 'bg-red-500' }}
          />
        </span>
      </>
    );
  };

  return (
    <Navbar
      innerClassName={`c-mainNav ${utilClass}`}
      leftClassName={'c-mainNav__left'}
      titleClassName={'c-mainNav__title'}
      rightClassName={'c-mainNav__right'}
      left={<LeftItems />}
      right={<RightItems />}
      subnavbarClassName={`c-mainNav__sub ${utilClass}`}
      subnavbar={
        isShowSearch && (
          <div style={{ display: 'block', width: '100%' }}>
            <Searchbar
              inputStyle={{ borderRadius: '30px' }}
            />
            <div
              className="c-mainNav__mask"
              onClick={() => onSearchClick()}
            ></div>
          </div>
        )
      }
    />
  );
}
