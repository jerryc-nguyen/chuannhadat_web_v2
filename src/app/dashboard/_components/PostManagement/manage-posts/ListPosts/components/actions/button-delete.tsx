'use client';
import { Button } from '@components/ui/button';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import ProductApiService from '../../apis/product-api';
import { toast } from 'sonner';

export const ButtonDelete = ({ productId }: { productId: number }) => {
  const { openModal, closeModal } = useModals();

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => ProductApiService.Delete({ productId }), // Mutation function
    onSuccess: (res: A) => {
      console.log('handleDelete success response', res);

      if (res.status === 200 && res.success === true && res.message) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ['collection-post'] }); // Invalidate cache to refetch product list
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
      className="my-2h-8 justify-start gap-2"
      onClick={showConfirmDelete}
    >
      <Trash2 size={16} /> <span className="text-sm">Xóa tin</span>
    </Button>
  );
};
