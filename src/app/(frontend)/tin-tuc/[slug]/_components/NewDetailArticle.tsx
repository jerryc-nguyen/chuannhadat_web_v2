import { cn, formatRelativeTime } from '@common/utils';
import { IArticleDetail } from '@frontend/NewsPage/types';
import parse, { attributesToProps, domToReact, HTMLReactParserOptions } from 'html-react-parser';
import { DotIcon, ExternalLink } from 'lucide-react';


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
    if (domNode && domNode.attribs && domNode.name === 'figcaption') {
      const props = attributesToProps(domNode.attribs);
      return (
        <figcaption {...props} className={cn('elm-figcaption py-2 text-center text-sm italic')}>
          {domToReact(domNode.children as any, optionsParser)}
        </figcaption>
      );
    }
  },
};

export const NewDetailArticle = ({ newDetail }: { newDetail: IArticleDetail | null }) => {
  return (
    <>
      {newDetail && (
        <div className="flex flex-col gap-4 pb-4">
          <div className="text-xl font-semibold">{newDetail?.title}</div>
          <div className="flex items-center">
            <span className="rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {formatRelativeTime(newDetail.posted_at)}
            </span>
            <DotIcon size={24} />
            <div className="text-14 font-semibold italic md:text-16">{newDetail.location}</div>
          </div>
          <div className="news-content">{parse(newDetail.content, optionsParser)}</div>
          <div className="flex justify-end">
            <a
              href={newDetail.origin_link}
              target="_blank"
              className="flex items-center gap-1 italic"
            >
              Theo{' '}
              <span className="text-blue-500 hover:font-semibold">{newDetail.origin_name}</span>{' '}
              <ExternalLink size={16} className="text-blue-500" />
            </a>
          </div>
        </div>
      )}
    </>
  );
};
