import { useReactTable } from '@tanstack/react-table';
import { Product } from '../data/schemas';
import { MobileItemV2 } from './MobileItemV2';

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
        return <MobileItemV2 key={key} product={product} />;
      })}
    </>
  );
};
