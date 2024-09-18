'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import useResizeImage from '@hooks/useResizeImage';
import { CiLocationOn } from 'react-icons/ci';
import { MdOutlinePriceChange } from 'react-icons/md';
import { IoMdTime } from 'react-icons/io';
import { IoIosPricetags, IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { FaBed } from 'react-icons/fa';
import { LuWarehouse } from 'react-icons/lu';
import { FaBath } from 'react-icons/fa6';
import { FaHouseUser } from 'react-icons/fa';

import { postDetailAtom } from '@mobile/post-detail/states';
import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { services } from '@api/services';
import { usePathname } from 'next/navigation';
import ImageCarousel from '@mobile/ui/ImageCarousel';
import Spinner from '@components/ui/spinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui/card';
import { Button } from '@components/ui/button';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';

import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';

export default function PostDetailMobile() {
  const currentPath = usePathname();
  const [productUid, setProductUid] = useState<string | null>(null);
  const [postDetail, setPostDetail] = useAtom(postDetailAtom);
  const { buildThumbnailUrl } = useResizeImage();

  useEffect(() => {
    const uid = currentPath.split('-').slice(-1)[0];
    if (uid && uid !== '') {
      setProductUid(uid);
    }
  }, [currentPath]);

  const { data, isLoading } = useQuery({
    queryKey: ['get-detail-post', productUid],
    queryFn: () => (productUid ? services.posts.getDetailPost(productUid) : Promise.resolve(null)),
    enabled: !!productUid && productUid !== '/', // Ensure query is enabled only if productUid is valid
    refetchOnWindowFocus: true, // Optional: refetch when window is focused
  });

  useEffect(() => {
    if (data) {
      setPostDetail(data.data);
    }
  }, [data, setPostDetail]);

  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  const [openSlideImage, setIsOpenSlideImage] = React.useState<boolean>(false);
  const [indexImageActive, setIndexImageActive] = React.useState<number>(0);
  const onClickImage = (indexImage: number) => {
    setIndexImageActive(indexImage);
    setIsOpenSlideImage(true);
  };

  useEffect(() => {
    const element = contentRef.current;
    if (element) {
      setIsOverflow(element.scrollHeight > 235);
    }
  }, [postDetail?.description]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const containers = document.querySelectorAll('.c-mobileApp');

    containers.forEach((container) => {
      if (isLoading) {
        (container as HTMLElement).style.height = '100vh';
      } else {
        (container as HTMLElement).style.height = 'auto';
      }
    });
  }, [isLoading]);

  if (isLoading)
    return (
      <div className="m-auto flex h-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="flex flex-col gap-4 p-0">
      <div className="rounded-b-2 flex flex-col gap-4 rounded-xl rounded-t-none bg-white p-4">
        {postDetail?.images && postDetail?.images.length > 0 ? (
          <ImageCarousel images={postDetail.images} onClick={onClickImage} />
        ) : (
          <AspectRatio.Root ratio={16 / 9}>
            <img
              className="Image"
              src={buildThumbnailUrl({
                imageUrl:
                  'https://cdn.dribbble.com/userupload/8392915/file/original-497a5e74203f601d33f76872e7ebaaa6.jpg',
              })}
              alt={(postDetail as any)?.name}
            />
          </AspectRatio.Root>
        )}
      </div>

      <Card className="rounded-t-none shadow-lg">
        <CardHeader>
          <CardTitle style={{ fontSize: '20px' }}>Mô tả chi tiết</CardTitle>
        </CardHeader>
        <CardContent
          ref={contentRef}
          className={`overflow-hidden ${isExpanded ? 'h-auto' : 'h-[235px]'} transition-all duration-300`}
        >
          {postDetail?.description &&
            postDetail?.description.split('+').map((line: string, index: number) => {
              if (line.trim() === '') return null;
              return (
                <div className="mb-1" key={index}>
                  {'+  ' + line.trim()}
                  <br />
                </div>
              );
            })}
        </CardContent>
        <CardFooter
          style={{
            justifyContent: 'center',
          }}
        >
          {' '}
          {postDetail?.description && isOverflow && !isExpanded && (
            <Button
              variant="link"
              onClick={handleToggleExpand}
              className="mt-2 flex items-center justify-center gap-2 text-blue-500 hover:underline"
            >
              Xem thêm <IoIosArrowDown />
            </Button>
          )}
          {isExpanded && (
            <Button
              variant="link"
              onClick={handleToggleExpand}
              className="mt-2 flex items-center justify-center gap-2 text-blue-500 hover:underline"
            >
              Thu gọn <IoIosArrowUp />
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card className="rounded-t-none shadow-lg">
        <CardHeader>
          <CardTitle style={{ fontSize: '20px' }}>{postDetail?.title ?? ''}</CardTitle>
          <CardDescription>
            <span className="text-xl font-semibold text-red-600">
              {postDetail?.formatted_price}
            </span>
            <span>-</span>
            <span className="text-sm text-slate-600">{postDetail?.formatted_price_per_m2}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {postDetail?.full_address && (
            <div className="flex gap-1">
              <CiLocationOn width={16} height={16} className="mt-[2px]" />
              <span className="text-sm text-slate-600">{postDetail?.full_address}</span>
            </div>
          )}
          {postDetail?.formatted_publish_at && (
            <div className="flex gap-1">
              <IoMdTime width={16} height={16} className="mt-[2px]" />
              <span className="text-sm text-slate-600">{postDetail?.formatted_publish_at}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-t-none shadow-lg">
        <CardHeader>
          <CardTitle style={{ fontSize: '20px' }}>Đặc điểm bất động sản</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row justify-between">
            <div className="flex gap-1">
              <IoIosPricetags width={16} height={16} className="mt-[2px]" />
              <span className="text-sm text-slate-600">{`Giá/m²: ${postDetail?.formatted_price_per_m2 || 0}`}</span>
            </div>
            <div className="flex gap-1">
              <FaBed width={16} height={16} className="mt-[2px]" />
              <span className="text-sm text-slate-600">{`Số phòng ngủ: ${postDetail?.bedrooms_count || 0}`}</span>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex gap-1">
              <LuWarehouse width={16} height={16} className="mt-[2px]" />
              <span className="text-sm text-slate-600">{`Tổng số tầng: ${postDetail?.floors_count || 0}`}</span>
            </div>
            <div className="flex gap-1">
              <FaBath width={16} height={16} className="mt-[2px]" />
              <span className="text-sm text-slate-600">{`Số phòng tắm: ${postDetail?.bathrooms_count || 0}`}</span>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex gap-1">
              <MdOutlinePriceChange width={16} height={16} className="mt-[2px]" />
              <span className="text-sm text-slate-600">{`Giấy tờ pháp lý: ${postDetail?.phap_ly ? 'Đã có sổ' : 'Chưa có sổ'}`}</span>
            </div>
            <div className="flex gap-1">
              <FaHouseUser width={16} height={16} className="mt-[2px]" />
              <span className="text-sm text-slate-600">{`Loại hình nhà: ${postDetail?.category_type || 'none'}`}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {openSlideImage && (
        <Lightbox
          open={openSlideImage}
          controller={{ closeOnPullDown: true }}
          index={indexImageActive}
          close={() => setIsOpenSlideImage(false)}
          styles={{
            root: { pointerEvents: 'auto' },
            slide: {
              maxWidth: '100%',
              maxHeight: '100%',
              overflow: 'hidden',
            },
          }}
          slides={postDetail?.images.map((item) => ({
            src: item.url,
          }))}
          thumbnails={{
            vignette: false,
            padding: 0,
            border: 0,
            height: 50, // Reduced height for better fit on small screens
            width: 70, // Reduced width for better fit on small screens
            imageFit: 'cover',
            hidden: postDetail?.images && postDetail?.images.length <= 1,
          }}
          counter={{ container: { style: { top: '0' } } }}
          render={{
            iconPrev: () => <GoArrowLeft className="text-2xl opacity-50 hover:opacity-100" />,
            iconNext: () => <GoArrowRight className="text-2xl opacity-50 hover:opacity-100" />,
          }}
          plugins={[Thumbnails,  Zoom, Counter]}
        />
      )}
    </div>
  );
}
