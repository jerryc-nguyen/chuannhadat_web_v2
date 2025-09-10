import { HoverCard, HoverCardContent, HoverCardTrigger } from '@components/ui/hover-card';
import React from 'react';
import UserCardContent from './UserCardContent';

type HoverCardAuthorProps = {
  authorSlug: string;
  children: React.ReactNode;
};
const HoverCardAuthor: React.FC<HoverCardAuthorProps> = ({ authorSlug, children }) => {
  const containerRef = React.useRef(null);
  return (
    <HoverCard openDelay={200} closeDelay={100} defaultOpen={false}>
      <HoverCardTrigger className="cursor-pointer" asChild>
        <div className="container-trigger" ref={containerRef}>
          {children}
        </div>
      </HoverCardTrigger>
      {authorSlug && (
        <HoverCardContent
          onClick={(e) => e.stopPropagation()}
          className="z-[11] min-w-[22rem] hover:cursor-default"
        >
          <UserCardContent authorSlug={authorSlug} />
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default HoverCardAuthor;
