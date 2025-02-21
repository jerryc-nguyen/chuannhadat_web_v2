import { useReactTable } from '@tanstack/react-table';
import { Product } from '../data/schemas';
import CardImageCarousel from '@views/home/components/CardImageCarousel';

type Props<T> = {
  table: T extends object ? ReturnType<typeof useReactTable<T>> : never;
  contentEmpty?: React.ReactNode;
};

export const ListPostMobile = <T extends Product>({ table, contentEmpty }: Props<T>) => {
  const rows = table.getRowModel().rows;

  if (!rows?.length) {
    return (
      <div className="flex h-40 items-center justify-center text-gray-500">{contentEmpty}</div>
    );
  }

  return (
    <>
      {rows.map((row, key) => {
        const product = row.original;

        console.log({ product });

        return (
          <div key={key}>
            <div className={`c-productCard overflow-hidden bg-white shadow-lg ${product.ads_type} p-4`}>
              <div className="">
                {/* {product.images && product.images.length > 0 && (
                  <CardImageCarousel product={product} />
                )} */}
              </div>
              <a
                href={`/post/${product.detail_path}`}
                target="_blank"
                className="c-ads_color mb-2 cursor-pointer font-bold text-secondary text-sm"
              >
                {product?.title}{' '}
              </a>
              {/* <div className="w-full text-secondary">{product.bus_cat_type}</div> */}
            </div>
          </div>
        );
      })}
    </>
  );
};
