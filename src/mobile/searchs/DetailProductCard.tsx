import React from 'react';
import { IProduct } from './type';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import useResizeImage from '@hooks/useResizeImage';
import { Breadcrumbs, BreadcrumbsItem, BreadcrumbsSeparator } from 'konsta/react';
import { CiLocationOn } from 'react-icons/ci';
import { MdOutlinePriceChange } from 'react-icons/md';
import { IoMdTime } from 'react-icons/io';
import { useGetDetailProduct } from '@api/get-detail-product';
import { IoIosPricetags } from 'react-icons/io';
import { FaBed } from 'react-icons/fa';
import { LuWarehouse } from 'react-icons/lu';
import { FaBath } from 'react-icons/fa6';
import SliderImage from './SliderImage';
import { FaHouseUser } from 'react-icons/fa';
import Link from 'next/link';
import SliderImage2 from './SliderImage2';
export default function DetailProductCard({ product }: { product: IProduct }) {
  const { data } = useGetDetailProduct(product.uid);
  console.log('detail_product', data?.data.data);

  const { buildThumbnailUrl } = useResizeImage();
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-4 rounded-xl bg-white p-4">
        <Breadcrumbs>
          <BreadcrumbsItem>
            <Link href={'/'} className="text-sm">
              Home
            </Link>
          </BreadcrumbsItem>
          <BreadcrumbsSeparator />
          <BreadcrumbsItem className="text-sm" active>
            {product.slug}
          </BreadcrumbsItem>
        </Breadcrumbs>
        {data?.data.data.images && data?.data.data.images.length > 0 ? (
      
          <SliderImage2 listImg={data.data.data.images} />
        ) : (
          <AspectRatio.Root ratio={16 / 9}>
            <img
              className="Image"
              src={buildThumbnailUrl({
                imageUrl:
                  'https://cdn.dribbble.com/userupload/8392915/file/original-497a5e74203f601d33f76872e7ebaaa6.jpg',
              })}
              alt={product?.name}
            />
          </AspectRatio.Root>
        )}
      </div>

      <div className="flex flex-col gap-1 rounded-xl bg-white p-4">
        <h4 className="text-lg font-bold">Mô tả chi tiết</h4>
        {data?.data?.data?.description &&
          data?.data?.data?.description.split('+').map((line, index) => {
            if (line.trim() === '') return null;
            return (
              <div className="mb-1" key={index}>
                {'+  ' + line.trim()}
                <br />
              </div>
            );
          })}
      </div>
      <div className="flex flex-col gap-2 rounded-xl bg-white p-4">
        <h4 className="text-lg font-bold">{data?.data?.data?.title ?? ''}</h4>
        <div className="flex items-center justify-start gap-2">
          <span className="text-xl font-semibold text-red-600">{product?.formatted_price}</span>
          <span>-</span>
          <span className="text-sm text-slate-600">{product?.formatted_price_per_m2}</span>
        </div>
        {data?.data?.data?.full_address && (
          <div className="flex gap-1">
            <CiLocationOn width={16} height={16} className="mt-[2px]" />
            <span className="text-sm text-slate-600">{data?.data?.data?.full_address}</span>
          </div>
        )}
        {data?.data?.data?.formatted_publish_at && (
          <div className="flex gap-1">
            <IoMdTime width={16} height={16} className="mt-[2px]" />
            <span className="text-sm text-slate-600">{data?.data?.data?.formatted_publish_at}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-white p-4">
        <h4 className="text-lg font-bold">Đặc điểm bất động sản</h4>

        {data?.data?.data?.formatted_price && (
          <div className="flex gap-1">
            <IoIosPricetags width={16} height={16} className="mt-[2px]" />
            <span className="text-sm text-slate-600">{`Giá/m²: ${data?.data?.data?.formatted_price_per_m2}`}</span>
          </div>
        )}
        {data?.data?.data?.formatted_price && (
          <div className="flex gap-1">
            <FaBed width={16} height={16} className="mt-[2px]" />
            <span className="text-sm text-slate-600">{`Số phòng ngủ:: ${data?.data?.data?.bedrooms_count ?? 1}`}</span>
          </div>
        )}

        {data?.data?.data?.formatted_price && (
          <div className="flex gap-1">
            <LuWarehouse width={16} height={16} className="mt-[2px]" />
            <span className="text-sm text-slate-600">{`Tổng số tầng: ${data?.data?.data?.floors_count ?? 1}`}</span>
          </div>
        )}
        {data?.data?.data?.formatted_price && (
          <div className="flex gap-1">
            <FaBath width={16} height={16} className="mt-[2px]" />
            <span className="text-sm text-slate-600">{`Số phòng tắm: ${data?.data?.data?.bathrooms_count ?? 1}`}</span>
          </div>
        )}

        {data?.data?.data?.formatted_price && (
          <div className="flex gap-1">
            <MdOutlinePriceChange width={16} height={16} className="mt-[2px]" />
            <span className="text-sm text-slate-600">{`Giấy tờ pháp lý: ${!!data?.data?.data?.phap_ly ? 'Đã có sổ' : 'Chưa có sổ'}`}</span>
          </div>
        )}
        {data?.data?.data?.formatted_price && (
          <div className="flex gap-1">
            <FaHouseUser width={16} height={16} className="mt-[2px]" />
            <span className="text-sm text-slate-600">{`Loại hình nhà: ${data?.data?.data?.category_type}`}</span>
          </div>
        )}
      </div>
    </div>
  );
}
