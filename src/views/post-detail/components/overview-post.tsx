import { services } from '@api/services';
import { useAuth } from '@common/auth/AuthContext';
import { DEFAULT_THUMB_IMAGE } from '@common/constants';
import { cn } from '@common/utils';
import BlurImage from '@components/BlurImage';
import TooltipHost from '@components/tooltip-host';
import { Button } from '@components/ui/button';
import { Skeleton } from '@components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import { YoutubePlayerAction } from '@components/youtube-player-modal';
import useCleanupEffect from '@hooks/useCleanupEffect';
import useResizeImage from '@hooks/useResizeImage';
import { IProductDetail } from '@mobile/searchs/type';
import { useMutation } from '@tanstack/react-query';
import ButtonSave, { type ButtonSaveHandle } from '@views/home/components/ButtonSave';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { MapPin, MoveRight, Share2, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Lightbox, { createModule, PLUGIN_THUMBNAILS, PluginProps } from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/plugins/counter.css';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import useModalPostDetail from '../hooks/useModalPostDetail';
import styles from '../styles/overvew-post.module.scss';
import NextJsImage from './next-image';
import SubTitleComponent from './subtitle-component';

type OverviewPostProps = {
  data: IProductDetail;
  isInsideModal?: boolean;
  isLoading?: boolean;
};

const OverviewPost: React.FC<OverviewPostProps> = ({ data, isInsideModal = false, isLoading }) => {
  const [openSlideImage, setIsOpenSlideImage] = React.useState<boolean>(false);
  const refButtonSave = React.useRef<ButtonSaveHandle>(null);
  const { currentUser } = useAuth();
  const [indexImageActive, setIndexImageActive] = React.useState<number>(0);
  const [isCopied, setIsCopied] = React.useState(false);
  const { onCloseModal } = useModalPostDetail();
  const router = useRouter();
  const { buildThumbnailUrl } = useResizeImage();

  const actionLightBox = {
    slide: NextJsImage,
    iconPrev: () => <ArrowLeft className="text-3xl opacity-50 hover:opacity-100" />,
    iconNext: () => <ArrowRight className="text-3xl opacity-50 hover:opacity-100" />,
    buttonPrev: data?.images.length <= 1 ? () => null : undefined,
    buttonNext: data?.images.length <= 1 ? () => null : undefined,
  };
  const { mutate: addViewPost } = useMutation({
    mutationFn: services.trackings.viewProduct,
  });
  useCleanupEffect(
    (helpers) => {
      if (isCopied) {
        helpers.setTimeout(() => {
          setIsCopied(false);
        }, 4000);
      }
    },
    [isCopied],
  );
  React.useEffect(() => {
    if (data?.uid) {
      addViewPost({
        product_uid: data.uid,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.uid]);
  const renderClassImages = (length: number) => {
    switch (length) {
      case 1:
        return styles['grid-item'];
      case 2:
        return styles['grid-two-items'];
      default:
        return styles['grid-multiple-items'];
    }
  };
  const handleSharePost = async () => {
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để sử dụng chức năng này');
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href || '');
        setIsCopied(true);
      } catch (err) {
        throw new Error('Không thể copy nội dung');
      }
    }
  };
  const onClickImage = (indexImage: number) => {
    setIndexImageActive(indexImage);
    setIsOpenSlideImage(true);
  };
  const SubTitleLightBox = ({ addChild }: PluginProps) => {
    addChild(
      PLUGIN_THUMBNAILS,
      createModule('SubTitle', () => <SubTitleComponent>{data?.title}</SubTitleComponent>),
    );
  };
  const renderLoadingOverview = () => (
    <div className={cn(styles.overview_post, 'relative rounded-lg border bg-white p-6')}>
      <div className={cn(styles.list_image, 'overflow-hidden rounded-lg', renderClassImages(3))}>
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className={cn(
              'image-item border-1 relative flex cursor-pointer items-center justify-center overflow-hidden shadow-md',
            )}
          >
            <Image
              className="z-0 h-full scale-110 opacity-100 bg-blend-lighten blur-xl grayscale transition-all"
              style={{
                objectFit: 'cover',
              }}
              fill
              alt={'loading-image'}
              title={'Loading image'}
              src={DEFAULT_THUMB_IMAGE}
            />
          </div>
        ))}
      </div>
      <div className="mb-2 mt-4">
        <Skeleton className="h-5" />
        <Skeleton className="mt-2 h-5" />
      </div>
      <Skeleton className="my-3 h-3" />
      <div className="flex flex-wrap items-center justify-between gap-y-2">
        <div className="flex gap-x-10">
          <div className="price flex flex-col gap-y-2 text-nowrap">
            <p className="font-medium">Mức giá</p>
            <Skeleton className="h-5 w-[60px]" />
            <Skeleton className="h-4 w-[50px]" />
          </div>
          <div className="area flex flex-col gap-y-2 text-nowrap">
            <p className="font-medium">Diện tích</p>
            <Skeleton className="h-5 w-[60px]" />
            <Skeleton className="h-4 w-[50px]" />
          </div>
        </div>
        <div className="action flex gap-x-4">
          <Button disabled variant={'outline'}>
            Chia sẻ
            <Share2 className="ml-2" />
          </Button>
          <div className="flex h-full items-center rounded-md border px-3 opacity-50 transition-all">
            Lưu tin
            <ButtonSave
              disabled
              ref={refButtonSave}
              className="opacity-1 visible relative right-0 top-0 border-0 !bg-transparent"
              postUid={data?.uid}
            />
          </div>
        </div>
      </div>
    </div>
  );
  const renderContentOverview = () => (
    <div className={cn(styles.overview_post, 'relative rounded-lg border bg-white p-6')}>
      <div
        className={cn(
          styles.list_image,
          'overflow-hidden rounded-lg',
          renderClassImages(data?.images.length),
        )}
      >
        {data?.images.slice(0, 3).map((item, index) => (
          <div
            key={item.id}
            className={cn(
              'image-item border-1 relative flex cursor-pointer items-center justify-center overflow-hidden shadow-md',
              data?.images.length > 3 && index === 2 ? styles['bg-overlay'] : '',
            )}
          >
            <BlurImage
              className="z-0 opacity-100 bg-blend-lighten transition-all"
              onClick={() => onClickImage(index)}
              style={{
                objectFit: 'cover',
              }}
              fill
              alt={data?.title}
              content={data?.title}
              title={data?.title}
              src={item.url}
            />
            <YoutubePlayerAction
              isDisplay={index === 0}
              youtube_url={data?.youtube_url as string}
            />
            {data?.images.length > 3 && index === 2 && (
              <Button
                onClick={() => setIsOpenSlideImage(true)}
                variant={'outline'}
                className="relative z-[7]"
              >
                Xem thêm {data?.images.length - 3} hình
              </Button>
            )}
          </div>
        ))}
      </div>

      <Lightbox
        className={styles.lightbox_images}
        open={openSlideImage}
        controller={{ closeOnPullDown: true }}
        index={indexImageActive}
        close={() => setIsOpenSlideImage(false)}
        styles={{ root: { pointerEvents: 'auto' } }}
        slides={data?.images.map((item) => ({
          src: item.url,
          thumbnail: buildThumbnailUrl({
            imageUrl: item.url,
            width: 100,
            ratio: 16 / 9,
          }),
        }))}
        carousel={{
          finite: false,
          preload: data?.images.length,
        }}
        animation={{
          fade: 0,
          swipe: 0,
        }}
        thumbnails={{
          vignette: false,
          padding: 0,
          border: 0,
          height: 66,
          width: 100,
          imageFit: 'cover',
          hidden: false,
          showToggle: false,
        }}
        counter={{ container: { style: { top: '0' } } }}
        render={actionLightBox}
        plugins={[Thumbnails, SubTitleLightBox, Zoom, Counter]}
      />
      <h2 className="mb-2 mt-4 line-clamp-2 whitespace-normal text-2xl font-bold">{data?.title}</h2>
      <div className="my-2 flex max-w-[90%] flex-nowrap items-center gap-x-2 text-lg text-secondary">
        <MapPin />
        <TooltipHost isOverflow content={data?.full_address}>
          {data?.full_address}
        </TooltipHost>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-y-2">
        <div className="flex gap-x-10">
          <div className="price flex flex-col text-nowrap">
            <p className="font-medium">Mức giá</p>
            <strong>{data?.formatted_price}</strong>
            <span className="text-xs italic text-secondary">{data?.formatted_price_per_m2}</span>
          </div>
          <div className="area flex flex-col text-nowrap">
            <p className="font-medium">Diện tích</p>
            <strong>{data?.formatted_area}</strong>
            <span className="text-xs italic text-secondary">{data?.formatted_kt}</span>
          </div>
        </div>
        <div className="action flex gap-x-4">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleSharePost} variant={'outline'}>
                  {isCopied ? 'Đã sao chép' : 'Chia sẻ'}
                  <Share2 className="ml-2" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-center">
                  Sao chép liên kết hoặc<br></br> chia sẻ qua
                  <br />
                  Facebook, Zalo
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div
            onClick={() => {
              refButtonSave.current?.onSaved();
            }}
            className="flex h-full cursor-pointer items-center rounded-md border px-3 transition-all hover:bg-slate-100"
          >
            Lưu tin
            <ButtonSave
              ref={refButtonSave}
              className="opacity-1 visible relative right-0 top-0 border-0 !bg-transparent"
              postUid={data?.uid}
            />
          </div>
          {isInsideModal && (
            <Button
              onClick={() => {
                router.push(data.detail_path);
                onCloseModal();
              }}
              className="border bg-primary_color/80 text-white hover:bg-primary_color"
              variant={'link'}
            >
              Xem chi tiết
              <MoveRight className="ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
  return isLoading ? renderLoadingOverview() : renderContentOverview();
};

export default OverviewPost;
