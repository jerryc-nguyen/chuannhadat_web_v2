import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@components/ui/sheet';
import { useAtom, useSetAtom } from 'jotai';
import { isLoadingModal, openModalDetail, selectedPostId } from '../states/modalPostDetailAtoms';
import { services } from '@api/services';
import { IProductDetail } from '@mobile/searchs/type';
import styles from '../styles/modal-post-detail.module.scss';
import { cn } from '@common/utils';
import OverviewPost from './overview-post';
import FeaturesPost from './features-post';
import DescriptionPost from './description-post';
import NotePost from './note-post';
import AuthorPost from './author-post';
import { useBrowserPushState } from '@components/popstate-handler/hooks';
import { useQuery } from '@tanstack/react-query';
import ViewedPosts from './ViewedPosts';
type ModalPostDetailProps = object;

const ModalPostDetail: React.FC<ModalPostDetailProps> = () => {
  const { trackPushPath, historyBack } = useBrowserPushState();
  const [isOpenModal, setIsOpenModal] = useAtom(openModalDetail);
  const setIsLoadingModal = useSetAtom(isLoadingModal);
  const [postId, setPostId] = useAtom(selectedPostId);
  const postContentRef = React.useRef<HTMLElement>(null);
  const { data, isLoading } = useQuery({
    queryKey: ['get-detail-post', postId],
    queryFn: () => services.posts.getDetailPost(postId),
    enabled: !!postId,
    select: (data) => data.data,
  });

  const updateBrowserPath = (product: IProductDetail) => {
    window.history.pushState({}, '', product.detail_path);
    trackPushPath(product.detail_path);
  };

  React.useEffect(() => {
    if (data) {
      setIsOpenModal(true);
      if (postContentRef.current) {
        postContentRef.current.scrollTop = 0;
      }
      updateBrowserPath(data);
    }
    setIsLoadingModal(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, postId]);

  const onOpenChange = (isOpen: boolean) => {
    setIsOpenModal(isOpen);
    if (!isOpen) {
      setPostId('');
      historyBack();
    }
  };

  return (
    <Sheet open={isOpenModal} onOpenChange={onOpenChange}>
      <SheetContent
        side={'left'}
        className={cn('flex !w-3/4 flex-col bg-gray-100', styles.modal_content_post)}
      >
        <SheetHeader>
          <SheetTitle>Đường dẫn</SheetTitle>
        </SheetHeader>
        <section
          ref={postContentRef}
          className="post-content relative flex flex-1 justify-between gap-x-4"
        >
          <div className="content-post flex flex-[3] flex-col gap-y-4">
            <OverviewPost isInsideModal data={data as IProductDetail} />
            <FeaturesPost data={data as IProductDetail} />
            <DescriptionPost data={data as IProductDetail} />
            <ViewedPosts isInsideModal productUid={data?.uid as string} />
            <NotePost />
          </div>
          <AuthorPost className="!top-0" data={data as IProductDetail} />
        </section>
      </SheetContent>
    </Sheet>
  );
};

export default ModalPostDetail;
