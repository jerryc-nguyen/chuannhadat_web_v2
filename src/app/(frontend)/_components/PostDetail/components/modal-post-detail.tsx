'use client';
import NotFound from '@app/not-found';
import { cn } from '@common/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@components/ui/sheet';
import { usePostDetail } from '@common/hooks/usePostDetail';
import { IProductDetail } from '@common/types'
import Breadcrumb, { ConvertFromBreadcrumbListJSONLd } from '@components/desktop/components/breadcrumb';
import { useAtom, useSetAtom } from 'jotai';
import React, { useMemo } from 'react';
import { isLoadingModal, openModalDetail, selectedPostId } from '../states/modalPostDetailAtoms';
import styles from '../styles/modal-post-detail.module.scss';
import AuthorPost from './author-post';
import DescriptionPost from './description-post';
import FeaturesPost from './features-post';
import NotePost from './note-post';
import OverviewPost from './overview-post';
import ViewedPosts from './ViewedPosts';

type ModalPostDetailProps = object;

const ModalPostDetail: React.FC<ModalPostDetailProps> = () => {
  const [isOpenModal, setIsOpenModal] = useAtom(openModalDetail);
  const setIsLoadingModal = useSetAtom(isLoadingModal);
  const [postId, setPostId] = useAtom(selectedPostId);
  const postContentRef = React.useRef<HTMLElement>(null);
  const { data, isLoading, isSuccess, isError } = usePostDetail({
    postId,
    enabled: !!postId,
  });

  // const updateBrowserPath = (product: IProductDetail) => {
  //   window.history.pushState({}, '', product.detail_path);
  //   trackPushPath(product.detail_path);
  // };

  React.useEffect(() => {
    // Scroll to top when modal opens and data loads
    if (data && isOpenModal && postContentRef.current) {
      postContentRef.current.scrollTop = 0;
    }

    // Update loading state for UI feedback
    setIsLoadingModal(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, postId, isOpenModal]);

  const breadcrumbsData = useMemo(() => {
    return ConvertFromBreadcrumbListJSONLd(data?.breadcrumb);
  }, [data?.breadcrumb]);
  if (isError || (isSuccess && !data))
    return <NotFound errorMessage="The current path of post detail is incorrect" />;
  const handleOpenChange = (isOpen: boolean) => {
    setIsOpenModal(isOpen);
    if (!isOpen) {
      setPostId('');
      // historyBack();
    }
  };
  return (
    <Sheet open={isOpenModal} onOpenChange={handleOpenChange}>
      <SheetContent
        side={'left'}
        className={cn('flex !w-3/4 flex-col bg-gray-100', styles.modal_content_post)}
      >
        <SheetHeader>
          <SheetTitle>
            <Breadcrumb breadcrumbs={breadcrumbsData} />
          </SheetTitle>
        </SheetHeader>
        <section
          ref={postContentRef}
          className="post-content relative flex flex-1 justify-between gap-x-4 overflow-x-auto p-0"
        >
          {isLoading && !data ? (
            // Loading state when modal opens before data arrives
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-gray-600">Đang tải thông tin bài đăng...</p>
              </div>
            </div>
          ) : (
            // Content when data is loaded
            <>
              <div className="content-post flex h-fit flex-[3] flex-col gap-y-4 overflow-hidden">
                <OverviewPost isInsideModal data={data as IProductDetail} />
                <FeaturesPost data={data as IProductDetail} />
                <DescriptionPost data={data as IProductDetail} />
                <ViewedPosts isInsideModal productUid={data?.uid as string} />
                <NotePost />
              </div>
              <AuthorPost data={data as IProductDetail} />
            </>
          )}
        </section>
      </SheetContent>
    </Sheet>
  );
};

export default ModalPostDetail;
