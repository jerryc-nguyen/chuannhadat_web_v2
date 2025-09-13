'use client';

import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { LucidePenSquare } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { DASHBOARD_ROUTES } from '@common/router';
const ButtonCreatePost = () => {
  const searchParams = useSearchParams();
  const hideDangtinButton = searchParams?.get('hide_create_post') == 'true';

  return (
    <Link
      href={DASHBOARD_ROUTES.posts.new}
      target="_blank"
      className={cn(hideDangtinButton && 'hidden')}
    >
      <Button
        asChild
        className="text-md ml-2 hidden items-center gap-x-2 rounded-md border bg-primary_color/80 px-6 py-2 font-medium text-white hover:bg-primary_color md:flex"
      >
        <span className="space-x-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <p>Đăng tin</p>
          <LucidePenSquare className="h-5 w-5" />
        </span>
      </Button>
    </Link>
  );
};

export default ButtonCreatePost;
