'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function AuthToastChecker() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loginRequired = searchParams.get('login_required');
    if (loginRequired === 'true') {
      // Use setTimeout to ensure toast is ready and to break render cycle if needed
      setTimeout(() => {
        toast.error('Bạn cần đăng nhập để xem nội dung này');

        // Clean up the URL
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('login_required');
        const paramsString = newParams.toString();
        const newUrl = paramsString ? `${pathname}?${paramsString}` : pathname;

        router.replace(newUrl);
      }, 100);
    }
  }, [searchParams, pathname, router]);

  return null;
}
