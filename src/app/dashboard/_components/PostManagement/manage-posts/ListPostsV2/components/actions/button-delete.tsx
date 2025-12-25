'use client';
import { Button } from '@components/ui/button';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import { useMutation } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import ProductApiService from '../../apis/product-api';
import { toast } from 'sonner';
import { useManagePostsCache } from '../../hooks/useManagePostsCache';

export const ButtonDelete = ({ productId }: { productId: number }) => {
  const { openModal, closeModal } = useModals();
  const { refreshDatagridList } = useManagePostsCache();

  const deleteMutation = useMutation({
    mutationFn: () => ProductApiService.Delete({ productId }), // Mutation function
    onSuccess: (res: A) => {
      if (res.status === 200 && res.success === true && res.message) {
        toast.success(res.message);
        refreshDatagridList(); // Invalidate cache to refetch product list
        closeModal(); // Close modal on success
      } else {
        toast.error(res.message);
      }
    },
    onError: (err: A) => {
      console.error('handleDelete error', err);
      const errMsg = err?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.';
      toast.error(errMsg); // Show error toast
    },
  });

  const showConfirmDelete = () => {
    openModal({
      name: 'ModalUpVipProduct',
      title: 'Xác nhận',
      content: <div>Bạn muốn xóa BDS ?</div>,
      footer: (
        <>
          <Button variant="ghost" onClick={closeModal}>
            Hủy
          </Button>
          <Button onClick={() => deleteMutation.mutate()}>OK</Button>
        </>
      ),
      showAsDialog: true,
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="mt-2 h-8 justify-start gap-2"
      onClick={showConfirmDelete}
    >
      <Trash2 size={16} /> <span className="text-sm">Xóa tin</span>
    </Button>
  );
};
