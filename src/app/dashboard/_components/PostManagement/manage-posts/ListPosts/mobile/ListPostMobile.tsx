import { useReactTable } from '@tanstack/react-table';
import { Product } from '../data/schemas';
import { CardItem } from './CardItem';

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
    <div className="px-4">
      {rows.map((row, key) => {
        const product = row.original;
        return <CardItem key={key} product={product} />;
      })}
    </div>
  );
};
