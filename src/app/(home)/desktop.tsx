'use client';

import React from 'react';

import MainNav from '@desktop/components/MainNav';
import './desktop.scss';
import FilterChips from '@mobile/filter_bds/FilterChips';
import { BtsModals1, BtsModals2, BtsModals3 } from '@mobile/modals';

export default function Desktop() {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <main className="c-layout1col">
      <header className="c-content__container sticky top-0 z-10 border-b">
        <MainNav></MainNav>
      </header>

      <main className="c-content c-content__container">
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tighter">
          Bán đất thổ cư, đất nông nghiệp có giá tốt nhất trên toàn quốc - T8/2024
        </h1>

        <FilterChips />

        <div className="c-content__gridWrap">
          <div className="c-content__grid">
            {items.map((item) => {
              return (
                <div key={item} className="min-720:gap-y-5 group relative flex flex-col gap-y-5">
                  <div className="min-720:rounded-28 min-720:bg-bg-secondary min-720:px-28 min-720:pb-28 min-720:pt-24 relative overflow-hidden p-[1px]">
                    <a className="min-720:gap-x-5 min-720:px-28 min-720:pb-28 min-720:pt-24 scrollbar-none min-720:scroll-pl-28 inset-0 flex w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth p-[1px]">
                      <img
                        src="https://placehold.jp/366x222.png"
                        alt="Mailchimp screen"
                        className="h-full w-full object-cover object-top"
                      ></img>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <BtsModals1 />
      <BtsModals2 />
      <BtsModals3 />
    </main>
  );
}
