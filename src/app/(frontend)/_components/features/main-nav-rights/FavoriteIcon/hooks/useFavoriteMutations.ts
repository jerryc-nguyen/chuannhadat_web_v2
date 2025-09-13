import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { savesApi } from '../api/saves';
import { ActionSaveProduct } from '@frontend/features/product-detail-actions/save-post/types';

/**
 * Hook for handling favorite-related mutations
 * Manages removing saved posts and viewed posts
 */
export const useFavoriteMutations = (
  invalidateQueries: () => Promise<void>,
  setLoadingDeleteUid: (uid: string) => void
) => {
  // Mutation for removing saved posts
  const { mutateAsync: removeSavedPostMutation } = useMutation({
    mutationFn: (productUid: string) =>
      savesApi.savePost({
        product_uid: productUid,
        action: ActionSaveProduct.Unlike,
      }),
    onError: (err: AxiosError) => {
      console.error('Error removing saved post:', err);
      toast.error('Xóa tin lưu không thành công');
    },
    onSuccess: async (data) => {
      if (data.status) {
        await invalidateQueries();
        toast.success('Xóa tin lưu thành công');
      } else {
        toast.error('Xóa tin lưu không thành công');
      }
    },
    onSettled: () => {
      setLoadingDeleteUid('');
    },
  });

  // Handler for removing saved posts
  const handleRemoveSavedPost = async (uid: string) => {
    setLoadingDeleteUid(uid);
    await removeSavedPostMutation(uid);
  };

  // Handler for removing viewed posts (uses existing hook)
  const handleRemoveViewedPost = async (
    uid: string,
    deleteViewedPost: (uid: string) => Promise<void>
  ) => {
    setLoadingDeleteUid(uid);
    await deleteViewedPost(uid);
    setLoadingDeleteUid('');
  };

  return {
    handleRemoveSavedPost,
    handleRemoveViewedPost,
  };
};
