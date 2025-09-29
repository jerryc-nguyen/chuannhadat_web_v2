interface ItemPropsProps {
  items: string[];
}

export function ItemProps({ items }: ItemPropsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 overflow-x-scroll whitespace-nowrap">
      {items.map((item) => (
        <span key={item} className="inline-flex items-center px-2 py-1 font-medium bg-gray-100 text-gray-700 rounded-full">
          {item}
        </span>
      ))}
    </div>
  );
}
