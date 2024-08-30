'use client';

import React from 'react';

import MainNav from '@desktop/components/MainNav';

export default function Desktop() {
  return (
    <>
      <div className="relative flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-xl items-center">
            <MainNav />
          </div>
        </header>

        <main className="w-full">
          <div className="container max-w-screen-xl">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter">
              Bán đất thổ cư, đất nông nghiệp có giá tốt nhất trên toàn quốc - T8/2024
            </h1>

            <button className="text-body-medium-bold border-bg-quarternary bg-bg-primary text-fg-primary hover:bg-bg-secondary hover:shadow-bg-quarternary relative cursor-pointer rounded-full border px-2 py-2 transition-colors ease-out focus-visible:ring-4 focus-visible:ring-blue-200/50">
              <span className="flex items-center justify-center gap-x-8">
                <span className="truncate">Business</span>
              </span>
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
