import Link from 'next/link';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { ButtonDelete, ButtonRefresh } from '../../../ListPosts/components/actions';
import { DASHBOARD_ROUTES } from '@common/router';

interface ActionBtnsProps {
  productId: number;
  productUid: string;
}

export const ActionBtns = ({ productId, productUid }: ActionBtnsProps) => (
  <div className="flex flex-col">
    <ButtonRefresh productId={productId} />
    <Link href={`${DASHBOARD_ROUTES.posts.edit}/${productUid}`}>
      <Button variant="outline" size="sm" className="mb-2 h-8 justify-start gap-2">
        <span className="icon"><svg width="16" height="16"><rect width="16" height="16" fill="none" /></svg></span>
        <span className="text-sm">Cập nhật tin</span>
      </Button>
    </Link>
    <Separator className="h-[1px]" />
    <ButtonDelete productId={productId} />
  </div>
);
