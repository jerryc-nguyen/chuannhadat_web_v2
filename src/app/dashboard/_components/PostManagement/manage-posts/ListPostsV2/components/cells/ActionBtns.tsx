import Link from 'next/link';
import { Button } from '@components/ui/button';
import { ButtonDelete, ButtonRefresh } from '../actions';
import { DASHBOARD_ROUTES } from '@common/router';
import { Pencil } from 'lucide-react';


interface ActionBtnsProps {
  productId: number;
  productUid: string;
}

export const ActionBtns = ({ productId, productUid }: ActionBtnsProps) => (
  <div className="flex flex-col">
    <ButtonRefresh productId={productId} />
    <Link href={`${DASHBOARD_ROUTES.posts.edit}/${productUid}`}>
      <Button variant="outline" size="sm" className="my-2 h-8 justify-start gap-2 w-full">
        <Pencil size={16} className="inline-block" />
        <span className="text-sm">Cập nhật tin</span>
      </Button>
    </Link>
    <ButtonDelete productId={productId} />
  </div>
);
