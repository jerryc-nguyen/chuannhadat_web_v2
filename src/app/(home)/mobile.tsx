'use client';

import React, { useState, useRef } from 'react';

import {
  App,
  Page,
  Navbar,
  Block,
  Button,
  List,
  ListItem,
  Link,
  BlockTitle,
  Searchbar,
  Icon,
} from 'konsta/react';
import {
  MdPerson,
  MdEmail,
  MdToday,
  MdFileUpload,
} from 'react-icons/md';
import MainNav from '@mobile/header/MainNav';
import { useAtom } from 'jotai';

import '@styles/pages/mobile/home.scss';
import { openFilterModalAtom } from '@mobile/filter_bds/states';
import FilterModal from '@mobile/filter_bds/FilterModal';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { btsModalAtom } from '@mobile/modals/states';
import ModalsFactory from '@mobile/modals';

export default function Mobile() {
  const [, setIsOpen] = useAtom(openFilterModalAtom);
  const [, openModal] = useAtom(btsModalAtom);

  const onClick = () => {
    openModal({ name: 'test_modal' });
  };

  return (
    <App theme='ios'>
      <Page>
        <MainNav
          type='SearchInSub'
          onSearchClick={() => setIsOpen(true)}
        />

        <BlockTitle>Navigation 3</BlockTitle>

        <List strongIos>
          <ListItem title='About' />
          <ListItem title='Form' />
        </List>

        <Block strong className='flex space-x-4'>
          <Button onClick={onClick}>Open Bottom Sheet</Button>
          <Button>Button 2</Button>
        </Block>

        <FilterModal />
        <ModalsFactory />
      </Page>
    </App>
  );
}
