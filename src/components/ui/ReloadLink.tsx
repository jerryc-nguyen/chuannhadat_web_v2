'use client';

import Link from 'next/link';
import React from 'react';

type ReloadLinkProps = {
  href: string | URL;
  children: React.ReactNode;
  className?: string;
  reload?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export default function ReloadLink({ href, children, className, reload = false, onClick }: ReloadLinkProps) {
  if (reload) {
    const hrefStr = typeof href === 'string' ? href : href.toString();
    return (
      <a
        href={hrefStr}
        className={className}
        onClick={(e) => {
          if (onClick) onClick(e);
          if (!e.defaultPrevented) {
            e.preventDefault();
            window.location.assign(hrefStr);
          }
        }}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}