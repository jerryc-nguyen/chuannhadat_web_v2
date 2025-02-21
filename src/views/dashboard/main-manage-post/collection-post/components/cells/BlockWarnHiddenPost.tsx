'use client';

import { TriangleAlert } from 'lucide-react';

interface BlockWarnHiddenPostProps {
  visible: boolean;
  isMobile?: boolean;
}

export function BlockWarnHiddenPost({ visible, isMobile }: BlockWarnHiddenPostProps) {
  if (isMobile && !visible) {
    return (
      <span className="text-xs font-semibold text-[#dc3545] inline-flex items-center gap-1">
        Tin bị ẩn
        <TriangleAlert className="inline-block" color="#dc3545" size={14} />
      </span>
    );
  }  

  return (
    <span className={`text-sm font-semibold text-[#dc3545] ${visible ? 'hidden' : ''}`}>
      <span className="mx-2"> · </span>
      <span className="space-x-1">
        <TriangleAlert className="inline-block" color="#dc3545" size={16} />
        <span> Tin đang bị ẩn! </span>
        <TriangleAlert className="inline-block" color="#dc3545" size={16} />
      </span>
    </span>
  );
}
