import { Button } from '@components/ui/button';
import { IProductDetail } from '@mobile/searchs/type';
import React from 'react';
import { LuHeart, LuMapPin, LuMoveRight, LuShare2 } from 'react-icons/lu';
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

type OverviewPostProps = {
  data: IProductDetail;
  isInsideModal?: boolean;
};

const OverviewPost: React.FC<OverviewPostProps> = ({ data, isInsideModal = false }) => {
  const [openSlideImage, setIsOpenSlideImage] = React.useState<boolean>(false);
  const [indexImageActive, setIndexImageActive] = React.useState<number>(0);
  const router = useRouter();
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
                className="relative z-10"
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
      <h2 className="mb-2 mt-4 text-2xl font-bold">{data?.title}</h2>
      <p className="my-2 flex items-center gap-x-2 text-lg text-slate-600">
        <LuMapPin />
        {data?.full_address}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex gap-x-10">
          <div className="price flex flex-col">
            <p className="font-medium">Mức giá</p>
            <strong>{data?.formatted_price}</strong>
            <span className="text-xs italic text-slate-500">{data?.formatted_price_per_m2}</span>
          </div>
          <div className="area flex flex-col">
            <p className="font-medium">Diện tích</p>
            <strong>{data?.formatted_area}</strong>
            <span className="text-xs italic text-slate-500">{data?.formatted_kt}</span>
          </div>
        </div>
        <div className="action flex gap-x-4">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={'outline'}>
                  Chia sẻ
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

          <Button variant={'outline'}>
            Lưu tin
            <LuHeart className="ml-2" />
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
