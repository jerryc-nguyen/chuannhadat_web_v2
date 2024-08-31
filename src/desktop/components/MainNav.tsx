'use client';

import Link from 'next/link';
import { cn } from '@common/utils';
import { usePathname } from 'next/navigation';

export default function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex">
      <Link href="/" className="mr-4 flex items-center space-x-2">
        <span className="font-bold">CND</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link
          href="/docs"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/docs' ? 'text-foreground' : 'text-foreground/60',
          )}
        >
          Docs
        </Link>
        <Link
          href="/docs/components"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/docs/components') &&
              !pathname?.startsWith('/docs/component/chart')
              ? 'text-foreground'
              : 'text-foreground/60',
          )}
        >
          Components
        </Link>
        <Link
          href="/blocks"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/blocks') ? 'text-foreground' : 'text-foreground/60',
          )}
        >
          Blocks
        </Link>
        <Link
          href="/charts"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/docs/component/chart') || pathname?.startsWith('/charts')
              ? 'text-foreground'
              : 'text-foreground/60',
          )}
        >
          Charts
        </Link>
        <Link
          href="/themes"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/themes') ? 'text-foreground' : 'text-foreground/60',
          )}
        >
          Themes
        </Link>
        <Link
          href="/examples"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/examples') ? 'text-foreground' : 'text-foreground/60',
          )}
        >
          Examples
        </Link>
        <Link
          href="/colors"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/colors') ? 'text-foreground' : 'text-foreground/60',
          )}
        >
          Colors
        </Link>
      </nav>
    </div>
  );
}
