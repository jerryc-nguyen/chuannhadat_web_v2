import { usePathname } from 'next/navigation';

/**
 * Hook to determine if the create post button should be hidden
 * Based on current route - hides on post creation/editing pages
 */
export function useHideCreateButton(): boolean {
  const pathname = usePathname();

  // Hide create button on post creation and editing pages
  if (!pathname) return false;

  return (
    pathname.startsWith('/dashboard/posts/new') ||
    (pathname.startsWith('/dashboard/posts/') && pathname !== '/dashboard/posts')
  );
}

export default useHideCreateButton;
