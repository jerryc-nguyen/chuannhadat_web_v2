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
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-4 rounded-xl bg-white p-4">
        {postDetail?.images && postDetail?.images.length > 0 ? (
          <ImageCarousel images={postDetail.images} />
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

      <div className="flex flex-col gap-1 rounded-xl bg-white p-4">
        <h4 className="text-lg font-bold">Mô tả chi tiết</h4>
        <div
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
        </div>
        {postDetail?.description && isOverflow && !isExpanded && (
          <button
            onClick={handleToggleExpand}
            className="mt-2 flex items-center justify-center gap-2 text-blue-500 hover:underline"
          >
            Xem thêm <IoIosArrowDown />
          </button>
        )}
        {isExpanded && (
          <button
            onClick={handleToggleExpand}
            className="mt-2 flex items-center justify-center gap-2 text-blue-500 hover:underline"
          >
            Thu gọn <IoIosArrowUp />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2 rounded-xl bg-white p-4">
        <h4 className="text-lg font-bold">{postDetail?.title ?? ''}</h4>
        <div className="flex items-center justify-start gap-2">
          <span className="text-xl font-semibold text-red-600">{postDetail?.formatted_price}</span>
          <span>-</span>
          <span className="text-sm text-slate-600">{postDetail?.formatted_price_per_m2}</span>
        </div>
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
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-white p-4">
        <h4 className="text-lg font-bold">Đặc điểm bất động sản</h4>

        {postDetail?.formatted_price && (
          <div className="flex gap-1">
            <IoIosPricetags width={16} height={16} className="mt-[2px]" />
            <span className="text-sm text-slate-600">{`Giá/m²: ${postDetail?.formatted_price_per_m2}`}</span>
          </div>
        )}
        {postDetail?.bedrooms_count && (
          <div className="flex gap-1">
            <FaBed width={16} height={16} className="mt-[2px]" />
            <span className="text-sm text-slate-600">{`Số phòng ngủ: ${postDetail?.bedrooms_count}`}</span>
          </div>
        )}
        <div className="flex flex-row justify-between">
          {postDetail?.floors_count && (
            <div className="flex gap-1">
              <LuWarehouse width={16} height={16} className="mt-[2px]" />
              <span className="text-sm text-slate-600">{`Tổng số tầng: ${postDetail?.floors_count}`}</span>
            </div>
          )}
          {postDetail?.bathrooms_count && (
            <div className="flex gap-1">
              <FaBath width={16} height={16} className="mt-[2px]" />
              <span className="text-sm text-slate-600">{`Số phòng tắm: ${postDetail?.bathrooms_count}`}</span>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-between">
          {postDetail?.phap_ly && (
            <div className="flex gap-1">
              <MdOutlinePriceChange width={16} height={16} className="mt-[2px]" />
              <span className="text-sm text-slate-600">{`Giấy tờ pháp lý: ${postDetail?.phap_ly ? 'Đã có sổ' : 'Chưa có sổ'}`}</span>
            </div>
          )}
          {postDetail?.category_type && (
            <div className="flex gap-1">
              <FaHouseUser width={16} height={16} className="mt-[2px]" />
              <span className="text-sm text-slate-600">{`Loại hình nhà: ${postDetail?.category_type}`}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
