'use client';

import React from 'react';

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
import MainNav from '@app/components/header/mobile/MainNav';
import { useAtom } from 'jotai';

import '@styles/pages/mobile/home.scss';
import { openFilterModalAtom } from '@app/components/filter_bds/states';
import FilterModal from '@app/components/filter_bds/mobile/FilterModal';

export default function Mobile() {
  const [_, setIsOpen] = useAtom(openFilterModalAtom);

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
          <Button onClick={() => {}}>Button 1</Button>
          <Button>Button 2</Button>
        </Block>

        <FilterModal />
      </Page>
    </App>
  );
}
