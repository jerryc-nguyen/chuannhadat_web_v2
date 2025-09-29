import HorizontalScroller from '@components/mobile-ui/HorizontalScroller';

interface ItemPropsProps {
  items: string[];
}

export function ItemProps({ items }: ItemPropsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <HorizontalScroller className="gap-2 whitespace-nowrap mb-1">
      {items.map((item) => (
        <span key={item} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
          {item}
        </span>
      ))}
    </HorizontalScroller>
  );
}
