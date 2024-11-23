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

import { genKey } from '@common/utils';
import { IBreadcrumbItem } from '@desktop/dashboard/states/breadcrumbAtom';
type BreadcrumbProps = {
  breadcrumbs: IBreadcrumbItem[];
};

export const ConvertFromBreadcrumbListJSONLd = (breadcrumb: A) => {
  return ((breadcrumb || {}).itemListElement || []).map((item: A) => {
    return {
      title: item.name,
      link: item.item
    }
  })
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumbs }) => {

  return (
    <BreadcrumbWrap>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          if (index !== breadcrumbs.length - 1) {
            return (
              <React.Fragment key={genKey(index)}>
                <BreadcrumbItem>
                  {item.isActive ? (
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.link}>
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
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          }
        })}
      </BreadcrumbList>
    </BreadcrumbWrap>
  );
};

export default Breadcrumb;
