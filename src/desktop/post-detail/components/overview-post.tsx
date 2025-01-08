import { Button } from '@components/ui/button';
import { IProductDetail } from '@mobile/searchs/type';
import React from 'react';
import { LuMapPin, LuMoveRight, LuShare2 } from 'react-icons/lu';
import Lightbox, { createModule, PLUGIN_THUMBNAILS, PluginProps } from 'yet-another-react-lightbox';
import NextJsImage from './next-image';
import Image from 'next/image';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import { cn } from '@common/utils';
import styles from '../styles/overvew-post.module.scss';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import SubTitleComponent from './subtitle-component';
import { useRouter } from 'next/navigation';
import useModalPostDetail from '../hooks/useModalPostDetail';
import { useMutation } from '@tanstack/react-query';
import { services } from '@api/services';
import TooltipHost from '@components/tooltip-host';
import ButtonSave, { type ButtonSaveHandle } from '@desktop/home/components/ButtonSave';
import { toast } from 'sonner';
import useAuth from '@mobile/auth/hooks/useAuth';

type OverviewPostProps = {
  data: IProductDetail;
  isInsideModal?: boolean;
};

const OverviewPost: React.FC<OverviewPostProps> = ({ data, isInsideModal = false }) => {
  const [openSlideImage, setIsOpenSlideImage] = React.useState<boolean>(false);
  const refButtonSave = React.useRef<ButtonSaveHandle>(null);
  const { currentUser } = useAuth();
  const [indexImageActive, setIndexImageActive] = React.useState<number>(0);
  const router = useRouter();
  const [isCopied, setIsCopied] = React.useState(false);

  const { mutate: addViewPost } = useMutation({
    mutationFn: services.trackings.viewProduct,
  });
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
        return 'grid-item';
      case 2:
        return 'grid-two-items';
      default:
        return 'grid-multiple-items';
    }
  };
  const handleSharePost = async () => {
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để sử dụng chức năng này');
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href || '');
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 4000);
      } catch (err) {
        console.error('Failed to copy: ', err);
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
  const { onCloseModal } = useModalPostDetail();
  return (
    <div className={cn(styles.overview_post, 'relative rounded-lg border bg-white p-6')}>
      <div
        className={cn(
          'list-image overflow-hidden rounded-lg',
          renderClassImages(data?.images.length),
        )}
      >
        {data?.images.slice(0, 3).map((item, index) => (
          <div
            key={item.id}
            className={cn(
              'image-item border-1 relative flex cursor-pointer items-center justify-center shadow-md',
              data?.images.length > 3 && index === 2 ? 'bg-overlay' : '',
            )}
          >
            <Image
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
          width: 3840,
          height: 2560,
        }))}
        thumbnails={{
          vignette: false,
          padding: 0,
          border: 0,
          height: 60,
          width: 90,
          imageFit: 'cover',
          hidden: data?.images.length <= 1,
        }}
        counter={{ container: { style: { top: '0' } } }}
        render={{
          slide: NextJsImage,
          iconPrev: () => <GoArrowLeft className="text-3xl opacity-50 hover:opacity-100" />,
          iconNext: () => <GoArrowRight className="text-3xl opacity-50 hover:opacity-100" />,
          buttonPrev: data?.images.length <= 1 ? () => null : undefined,
          buttonNext: data?.images.length <= 1 ? () => null : undefined,
        }}
        plugins={[Thumbnails, SubTitleLightBox, Zoom, Counter]}
      />
      <h2 className="mb-2 mt-4 line-clamp-2 whitespace-normal text-2xl font-bold">{data?.title}</h2>
      <p className="my-2 flex max-w-[90%] flex-nowrap items-center gap-x-2 text-lg text-secondary">
        <LuMapPin />
        <TooltipHost isOverflow content={data?.full_address}>
          {data?.full_address}
        </TooltipHost>
      </p>
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
                  <LuShare2 className="ml-2" />
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
          <Button
            onClick={() => {
              refButtonSave.current?.onSaved();
            }}
            className="relative"
            variant={'outline'}
          >
            Lưu tin
            <ButtonSave
              ref={refButtonSave}
              className="relative right-0 top-0 border-0 !bg-transparent"
              postUid={data?.uid}
            />
          </Button>
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
              <LuMoveRight className="ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewPost;
