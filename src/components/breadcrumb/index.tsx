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
import { breadcrumbAtom } from '@desktop/dashboard/atoms/breadcrumbAtom';
import { genKey } from '@common/utils';
type BreadcrumbProps = object;

const Breadcrumb: React.FC<BreadcrumbProps> = () => {
  const breadcrumb = useAtomValue(breadcrumbAtom);

  return (
    <BreadcrumbWrap>
      <BreadcrumbList>
        {breadcrumb.map((item, index) => {
          if (index !== breadcrumb.length - 1) {
            return (
              <React.Fragment key={genKey(index)}>
                <BreadcrumbItem>
                  {item.isActive ? (
                    <BreadcrumbPage className="text-lg">{item.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink className="text-lg" href={item.link}>
                      {item.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            );
          } else {
            return (
              <BreadcrumbItem key={item.title}>
                <BreadcrumbPage className="text-lg">{item.title}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          }
        })}
      </BreadcrumbList>
    </BreadcrumbWrap>
  );
};

export default Breadcrumb;
