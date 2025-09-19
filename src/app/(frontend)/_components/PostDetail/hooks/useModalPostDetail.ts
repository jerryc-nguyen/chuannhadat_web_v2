import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { isLoadingModal, openModalDetail, selectedPostId } from '../states/modalPostDetailAtoms';
import { useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/posts';
import { postDetailAtom } from '../states/postDetailAtoms';
import usePostDetailTracking from './usePostDetailTracking';

export default function useModalPostDetail() {
  const [postIdModal, setSelectedPostId] = useAtom(selectedPostId);
  const isLoadingDataModal = useAtomValue(isLoadingModal);
  const setIsOpenModal = useSetAtom(openModalDetail);
  const postDetailDataModal = useAtomValue(postDetailAtom);
  const queryClient = useQueryClient();

  // Use the tracking hook for view tracking
  const { trackPostView } = usePostDetailTracking();
  const onCloseModal = () => {
    setSelectedPostId('');
    setIsOpenModal(false);
  };
  const handleOpenModal = async (postId: string) => {
    // 1. Set post ID
    setSelectedPostId(postId);

    // 2. Track view when modal opens
    trackPostView(postId);

    // 3. Open modal immediately
    setIsOpenModal(true);

    // 4. Prefetch data for better performance
    queryClient.prefetchQuery({
      queryKey: ['get-detail-post', postId],
      queryFn: () => postsApi.getDetailPost(postId),
    });
  };
  return {
    handleOpenModal,
    onCloseModal,
    postIdModal,
    isLoadingDataModal,
    postDetailDataModal,
  };
}
