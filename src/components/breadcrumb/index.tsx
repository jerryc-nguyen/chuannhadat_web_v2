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
import { breadcrumbAtom } from '@desktop/dashboard/states/breadcrumbAtom';
import Link from 'next/link';
import { genKey } from '@common/utils';
type BreadcrumbProps = object;

const Breadcrumb: React.FC<BreadcrumbProps> = () => {
  const breadcrumb = useAtomValue(breadcrumbAtom);
  return (
    <BreadcrumbWrap className="bg-[#F5F6FA] p-4 sm:bg-transparent sm:!p-0">
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
  );
};

export default Breadcrumb;
