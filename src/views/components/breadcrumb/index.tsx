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
import { IBreadcrumbItem } from '@views/dashboard/states/breadcrumbAtom';

type BreadcrumbProps = {
  breadcrumbs: IBreadcrumbItem[];
  isLastLink?: boolean;
};

export const ConvertFromBreadcrumbListJSONLd = (breadcrumb: A) => {
  return ((breadcrumb || {}).itemListElement || []).map((item: A) => {
    return {
      title: item.name,
      link: item.item
    }
  })
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumbs, isLastLink = false }) => {

  return (
    <BreadcrumbWrap>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const showAll = isLastLink && index <= breadcrumbs.length - 1;

          if (showAll || index < breadcrumbs.length - 1) {
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
                {index !== breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator />
                )}
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
