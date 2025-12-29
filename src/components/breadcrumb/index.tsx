'use client';
import React from 'react';
import {
  Breadcrumb as BreadcrumbWrap,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@components/ui/breadcrumb';
import { useAtomValue } from 'jotai';
import { breadcrumbAtom } from '@dashboard/DashboardLayout/states/breadcrumbAtom';
import Link from 'next/link';
import { genKey } from '@common/utils';
import { HorizontalScrollContainer } from '@components/ui/HorizontalScrollContainer';

type BreadcrumbProps = object;

const Breadcrumb: React.FC<BreadcrumbProps> = () => {
  const breadcrumb = useAtomValue(breadcrumbAtom);

  return (
    <div className="relative bg-[#F5F6FA] sm:bg-transparent">
      {/* Mobile: Horizontal scroll with navigation buttons */}
      <div className="block sm:hidden">
        <HorizontalScrollContainer
          activeItemSelector='[data-breadcrumb-active="true"]'
          dependencies={[breadcrumb]}
        >
          <BreadcrumbWrap className="w-fit min-w-full">
            <BreadcrumbList className="flex-nowrap whitespace-nowrap">
              {breadcrumb.map((item, index) => {
                const isLast = index === breadcrumb.length - 1;
                return (
                  <React.Fragment key={genKey(index)}>
                    <BreadcrumbItem
                      className="flex-shrink-0"
                      data-breadcrumb-active={isLast}
                    >
                      {item.isActive ? (
                        <BreadcrumbPage className="text-sm font-medium text-primary_color">
                          {item.title}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          asChild
                          className="breadcrumb-link text-sm font-medium transition-all hover:font-medium hover:underline"
                          href={item.link}
                        >
                          <Link href={item.link}>{item.title}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator className="flex-shrink-0" />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </BreadcrumbWrap>
        </HorizontalScrollContainer>
      </div>

      {/* Desktop: Original layout */}
      <div className="hidden sm:block">
        <BreadcrumbWrap className="p-0">
          <BreadcrumbList>
            {breadcrumb.map((item, index) => {
              if (index !== breadcrumb.length - 1) {
                return (
                  <React.Fragment key={genKey(index)}>
                    <BreadcrumbItem>
                      {item.isActive ? (
                        <BreadcrumbPage className="text-base">{item.title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          asChild
                          className="breadcrumb-link text-base font-medium transition-all hover:font-medium hover:underline"
                          href={item.link}
                        >
                          <Link href={item.link}>{item.title}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </React.Fragment>
                );
              } else {
                return (
                  <BreadcrumbItem key={item.title}>
                    <BreadcrumbPage className="text-base font-medium text-primary_color">
                      {item.title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                );
              }
            })}
          </BreadcrumbList>
        </BreadcrumbWrap>
      </div>
    </div>
  );
};

export default Breadcrumb;
