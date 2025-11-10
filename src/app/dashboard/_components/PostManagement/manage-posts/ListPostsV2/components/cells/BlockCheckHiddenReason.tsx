'use client';

import { Fragment } from 'react';
import hideOnFrontendReasonConstant from '../../constant/hide_on_frontend_reason';
import { cn } from '@common/utils';

interface BlockCheckHiddenReasonProps {
  hide_on_frontend_reason: string;
}

export function BlockCheckHiddenReason({ hide_on_frontend_reason }: BlockCheckHiddenReasonProps) {
  if (!hide_on_frontend_reason) {
    return null;
  }
  return (
    <div className={cn("mb-4 flex w-full overflow-hidden rounded-lg border border-[#9f3a38] bg-[#fff6f6] md:rounded-xl lg:flex-row lg:items-center", "p-2 md:p-4")}>
      <span className="text-xs md:text-sm text-[#9f3a38]">
        {hideOnFrontendReasonConstant
          .find((item) => item.value === hide_on_frontend_reason)
          ?.content.map((line, index) => (
            <Fragment key={index}>
              {line.trim()}
              <br />
            </Fragment>
          ))}
      </span>
    </div>
  );
}
