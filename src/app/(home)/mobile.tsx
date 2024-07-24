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
import {
  filterStateAtom,
  localFilterStateAtom,
  openFilterModalAtom,
} from '@mobile/filter_bds/states';
import FilterModal from '@mobile/filter_bds/FilterModal';

import { BtsModals1, BtsModals2, BtsModals3 } from '@mobile/modals';
import FilterChips from '@mobile/filter_bds/FilterChips';
import useModals from '@mobile/modals/hooks';
import FooterBtsButton from '@mobile/filter_bds/FooterBtsButton';
export default function Mobile() {
  const { openModal, closeModals } = useModals();
  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  const onApplyFilter = () => {
    setFilterState({ ...filterState, ...localFilterState });
    closeModals();
  };

  const openFilterModal = () => {
    openModal({
      name: 'filter_modal',
      title: 'Lọc',
      content: <FilterModal />,
      maxHeightPercent: 1,
      footer: (
        <>
          <Button onClick={onApplyFilter}>Xem kết quả</Button>
        </>
      ),
    });
  };
  return (
    <App theme='ios'>
      <Page>
        <MainNav
          type='SearchInSub'
          onSearchClick={() => openFilterModal()}
        />

        <FilterChips />
        <BlockTitle>Navigation 3</BlockTitle>

        <List strongIos>
          <ListItem title='About' />
          <ListItem title='Form' />
        </List>

        <Block strong className='flex space-x-4'>
          <Button onClick={() => {}}>Open Bottom Sheet</Button>
          <Button>Button 2</Button>
        </Block>

        <BtsModals1 />
        <BtsModals2 />
        <BtsModals3 />
      </Page>
    </App>
  );
}
