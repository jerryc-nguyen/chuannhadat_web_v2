'use client';

import React from 'react';

import {
  App,
  Page,
  Block,
  Button,
  List,
  ListItem,
  BlockTitle,
} from 'konsta/react';

import MainNav from '@mobile/header/MainNav';
import '@styles/pages/mobile/home.scss';
import FilterModal from '@mobile/filter_bds/FilterModal';
import { BtsModals1, BtsModals2, BtsModals3 } from '@mobile/modals';
import FilterChips from '@mobile/filter_bds/FilterChips';
import useModals from '@mobile/modals/hooks';
import FooterOverviewBtsButton from '@mobile/filter_bds/FooterOverviewBtsButton';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import PostList from '@mobile/searchs/PostList';

export default function Mobile() {
  const { openModal } = useModals();
  const { copyFilterStatesToLocal } = useFilterState();

  const openFilterModal = () => {
    copyFilterStatesToLocal();
    openModal({
      name: 'filter_modal',
      title: 'Lọc',
      content: <FilterModal />,
      maxHeightPercent: 1,
      footer: <FooterOverviewBtsButton />,
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
        <PostList />
        <BtsModals1 />
        <BtsModals2 />
        <BtsModals3 />
      </Page>
    </App>
  );
}
