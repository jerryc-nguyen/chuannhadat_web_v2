'use client';

import React from 'react';

import MainNav from '@desktop/components/MainNav';
import './desktop.scss';

export default function Desktop() {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <main className="layout-vars isolate mx-auto flex max-w-[3840px] grow flex-col">
      <header className="px-container-x-padding sticky top-0 z-10 border-b">
        <MainNav></MainNav>
      </header>

      <main className="flex grow flex-col">
        <div className="px-container-x-padding z-0 flex flex-col gap-y-5 pt-2">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter">
            Bán đất thổ cư, đất nông nghiệp có giá tốt nhất trên toàn quốc - T8/2024
          </h1>

          <MainNav></MainNav>

          <MainNav></MainNav>

          <div className="relative -z-10 flex min-h-[calc(100vh-var(--navbar-height)-12px)] min-w-0 flex-col">
            <div className="min-720:[--column-gap:24px] min-720:gap-y-5 min-720:[--min-column-width:324px] min-840:[--min-column-width:384px] grid grid-cols-[repeat(auto-fill,minmax(max(var(--min-column-width),var(--max-column-width)),1fr))] content-start gap-x-[--column-gap] gap-y-5 [--column-gap:1.25em] [--max-column-count:5] [--max-column-width:calc((100%-var(--total-gap-width))/var(--max-column-count))] [--min-column-width:380px] [--total-gap-width:calc((var(--max-column-count)-1)*var(--column-gap))]">
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
        </div>
      </main>
    </main>
  );
}
