"use client";
import Image from 'next/image';
import empty_city from '@assets/images/empty-city.png';
import { useBreadcrumb } from '@hooks';

export const UnderDevelopment = () => {
  useBreadcrumb([
    { title: "Hashtag của bạn" , link: '/dashboard/manage-post/your-hashtag', isActive: true },
  ]);

  return (
    <section className="mb-5 flex min-h-[50vh] flex-col items-center justify-center p-5">
      <Image className="mb-6 w-full md:w-2/3" src={empty_city} alt="Đang phát triển" />
      <h3 className="text-xl md:text-2xl font-bold text-center">Tính năng đang được phát triển</h3>
      <p className="mt-2 w-3/4 text-center text-base text-foreground">
        Tính năng này đang được phát triển, hãy quay lại sau nhé. Cảm ơn bạn đã quan tâm.
      </p>
    </section>
  );
};
