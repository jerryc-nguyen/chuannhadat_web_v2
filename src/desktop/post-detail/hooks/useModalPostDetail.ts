import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { isLoadingModal, openModalDetail, selectedPostId } from '../states/modalPostDetailAtoms';
import { useQueryClient } from '@tanstack/react-query';
import { services } from '@api/services';
import { postDetailAtom } from '../states/postDetailAtoms';

export default function useModalPostDetail() {
  const [postIdModal, setSelectedPostId] = useAtom(selectedPostId);
  const isLoadingDataModal = useAtomValue(isLoadingModal);
  const setIsOpenModal = useSetAtom(openModalDetail);
  const postDetailDataModal = useAtomValue(postDetailAtom);
  const queryClient = useQueryClient();
  const onCloseModal = () => {
    setSelectedPostId('');
    setIsOpenModal(false);
  };
  const handleOpenModal = async (postId: string) => {
    setSelectedPostId(postId);
    await queryClient.prefetchQuery({
      queryKey: ['get-detail-post', postId],
      queryFn: () => services.posts.getDetailPost(postId),
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
