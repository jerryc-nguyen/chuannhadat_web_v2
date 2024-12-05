import { getQueryClient } from '@api/react-query';
import { services } from '@api/services';
import { cn, formatRelativeTime } from '@common/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import parse, { attributesToProps, domToReact } from 'html-react-parser';
import type { DOMNode, HTMLReactParserOptions } from 'html-react-parser';

type Props = {
  params: { slug: string };
  searchParams: { ref: string };
};

const optionsParser: HTMLReactParserOptions = {
  replace(domNode: any) {
    if (domNode && domNode.attribs && domNode.name === 'p') {
      const props = attributesToProps(domNode.attribs);
      return (
        <p {...props} className={cn('elm-p pb-3')}>
          {domToReact(domNode.children as any, optionsParser)}
        </p>
      );
    }
  },
};
export default async function Page({ params, searchParams }: Props) {
  if (!searchParams.ref) return notFound();

  const queryClient = getQueryClient();
  const data = await queryClient.fetchQuery({
    queryKey: ['get-news-detail', searchParams.ref],
    queryFn: async () => {
      const res = await services.news.getNewsDetail(searchParams.ref);
      return res.data;
    },
  });

  return (
    <section className="flex flex-col gap-4 p-4 max-w-screen-lg">
      <div className="text-xl font-semibold">{data.title}</div>
      <div className='flex'>
        <span className="me-2 rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          {formatRelativeTime(data.posted_at)}
        </span>
      </div>
      <div className="news-content">{parse(data.content, optionsParser)}</div>
      <div className="flex justify-between">
        <div className="font-semibold italic">{data.location}</div>
        <a href={data.origin_link} target="_blank" className="italic text-blue-500 underline">
          Nguồn
        </a>
      </div>
    </section>
  );
}
