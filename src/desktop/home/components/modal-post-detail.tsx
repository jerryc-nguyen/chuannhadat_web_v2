import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@components/ui/sheet';
import { useAtom, useSetAtom } from 'jotai';
import { isLoadingModal, openModalDetail, selectedPostId } from '../states/modalPostDetailAtoms';
import { services } from '@api/services';
import { useQuery } from '@tanstack/react-query';
import OverviewPost from '@desktop/post-detail/components/overview-post';
import FeaturesPost from '@desktop/post-detail/components/features-post';
import DescriptionPost from '@desktop/post-detail/components/description-post';
import NotePost from '@desktop/post-detail/components/note-post';
import AuthorPost from '@desktop/post-detail/components/author-post';
import { IProductDetail } from '@mobile/searchs/type';
import styles from '../styles/modal-post-detail.module.scss';
import { cn } from '@common/utils';
type ModalPostDetailProps = object;

const ModalPostDetail: React.FC<ModalPostDetailProps> = () => {
  const [isOpenModal, setIsOpenModal] = useAtom(openModalDetail);
  const setIsLoadingModal = useSetAtom(isLoadingModal);
  const [postId, setPostId] = useAtom(selectedPostId);
  const { data, isLoading } = useQuery({
    queryKey: ['get-detail-post', postId],
    queryFn: () => services.posts.getDetailPost(postId),
    enabled: !!postId,
    select: (data) => data.data,
  });
  React.useEffect(() => {
    if (data) {
      setIsOpenModal(true);
    }
    setIsLoadingModal(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, postId]);
  React.useEffect(() => {
    if (!isOpenModal) {
      setPostId('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenModal]);
  return (
    <Sheet open={isOpenModal} onOpenChange={setIsOpenModal}>
      <SheetContent
        side={'left'}
        className={cn('flex !w-3/4 flex-col bg-gray-100', styles.modal_content_post)}
      >
        <SheetHeader>
          <SheetTitle>Đường dẫn</SheetTitle>
        </SheetHeader>
        <section className="post-content relative flex flex-1 justify-between gap-x-4">
          <div className="content-post flex flex-[3] flex-col gap-y-4">
            <OverviewPost data={data as IProductDetail} />
            <FeaturesPost data={data as IProductDetail} />
            <DescriptionPost data={data as IProductDetail} />
            <NotePost />
          </div>
          <AuthorPost className='!top-0' data={data as IProductDetail} />
        </section>
      </SheetContent>
    </Sheet>
  );
};

export default ModalPostDetail;
