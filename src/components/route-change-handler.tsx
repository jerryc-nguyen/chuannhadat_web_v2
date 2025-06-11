import useRouteChangeHandler from '@hooks/useRouteChangeHandler';
import useScrollRestoration from '@hooks/useScrollRestoration';

/**
 * Component that handles route changes without rendering anything
 * This can be added to your layout to handle route changes application-wide
 */
export default function RouteChangeHandler() {
  // Use the hook to handle route changes
  useRouteChangeHandler({
    resetFiltersOnProfilePage: true,
  });

  // Use the scroll restoration hook
  useScrollRestoration();

  // This component doesn't render anything
  return null;
} 
