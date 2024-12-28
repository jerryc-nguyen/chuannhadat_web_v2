import { cn } from '@common/utils';
import Spinner from '@components/ui/spinner';

type PropsRouteLoading = {
  classname?: string;
};
export const RouteLoading = ({ classname }: PropsRouteLoading) => {
  return (
    <div className={cn('flex h-full min-h-[50vh] w-full items-center justify-center', classname)}>
      <Spinner />
    </div>
  );
};
