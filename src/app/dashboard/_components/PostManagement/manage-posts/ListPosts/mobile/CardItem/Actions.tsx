import { Button } from '@components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { SquarePen, MoreVertical, RefreshCw, Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
  ButtonUpVip,
  CheckboxAutoRefresh,
} from '../../components/actions';
import ProductApiService from '../../apis/product-api';
import { useManagePostsCache } from '../../hooks/useManagePostsCache';
import { toast } from 'sonner';
import useProductActionSetting from '../../hooks/product-action-setting';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import { DASHBOARD_ROUTES } from '@common/router';

interface ActionsProps {
  productId: string;
  productUid: string;
  adsType: string;
  autoRefreshProduct: boolean;
}

export function Actions({ productId, productUid, adsType, autoRefreshProduct }: ActionsProps) {
  const { decreaseTotalRefreshsCount } = useProductActionSetting();
  const { updateFieldDataOnRow } = useManagePostsCache();
  const { openModal, closeModal } = useModals();

  const handleRefresh = async () => {
    try {
      const res: A = await ProductApiService.Refresh({
        productId: productId,
      });
      console.log('handleRefresh success response', res);

      if (res.status === true && res.message) {
        toast.success(res.message);
        decreaseTotalRefreshsCount();
        updateFieldDataOnRow(productId, [
          {
            setterKey: 'formatted_published_at',
            newValue: 'Vừa xong',
          },
        ]);
      } else {
        toast.error(res.message);
      }
    } catch (err: A) {
      console.error('handleRefresh error', err);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  const handleDelete = () => {
    openModal({
      name: 'ModalUpVipProduct',
      title: 'Xác nhận',
      content: <div>Bạn muốn xóa BDS ?</div>,
      footer: (
        <>
          <Button variant="ghost" onClick={closeModal}>
            Hủy
          </Button>
          <Button onClick={async () => {
            try {
              const res: A = await ProductApiService.Delete({ productId: productId });
              console.log('handleDelete success response', res);

              if (res.status === 200 && res.success === true && res.message) {
                toast.success(res.message);
                // Invalidate cache - you might need to handle this differently
                closeModal();
              } else {
                toast.error(res.message);
              }
            } catch (err: A) {
              console.error('handleDelete error', err);
              toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
            }
          }}>OK</Button>
        </>
      ),
      showAsDialog: true,
    });
  };

  return (
    <div className="px-4 pt-3 pb-4">
      {/* Primary Actions - Single Row */}
      <div className="flex gap-2 overflow-x-auto">
        <ButtonUpVip productId={productId} adsType={adsType} />
        <CheckboxAutoRefresh
          productId={productId}
          auto_refresh_product={autoRefreshProduct}
        />

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
              <MoreVertical size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`${DASHBOARD_ROUTES.posts.edit}/${productUid}`} className="cursor-pointer">
                <SquarePen size={16} className="mr-2" />
                <span>Sửa tin</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRefresh} className="cursor-pointer">
              <RefreshCw size={16} className="mr-2" />
              <span>Làm mới tin</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="cursor-pointer">
              <Trash2 size={16} className="mr-2" />
              <span>Xóa tin</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
