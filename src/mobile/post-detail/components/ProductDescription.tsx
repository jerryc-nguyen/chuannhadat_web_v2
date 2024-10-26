import FormatHtml from '@components/FormatHtml';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@components/ui/card';
import { IProductDetail } from '@mobile/searchs/type';
import { useEffect, useRef, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

type IProps = {
  product?: IProductDetail;
};

export default function ProductDescription({ product }: IProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const element = contentRef.current;
    if (element) {
      setIsOverflow(element.scrollHeight > 235);
    }
  }, [product?.description]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="rounded-none">
      <CardHeader className="px-4">
        <CardTitle>Mô tả chi tiết</CardTitle>
      </CardHeader>
      <CardContent
        ref={contentRef}
        className={`overflow-hidden px-4 ${isExpanded ? 'h-auto' : 'h-[235px]'} transition-all duration-300`}
      >
        <FormatHtml content={product?.description || ''} />
      </CardContent>
      <CardFooter
        style={{
          justifyContent: 'center',
        }}
      >
        {product?.description && isOverflow && !isExpanded && (
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
  );
}
