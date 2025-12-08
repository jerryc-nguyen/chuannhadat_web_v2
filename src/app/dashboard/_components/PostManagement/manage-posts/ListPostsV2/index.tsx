"use client";

import React from "react";
import { PostsListProvider } from "./context/PostsListProvider";
import Desktop from "./views/Desktop";
import Mobile from "./views/Mobile";

type ListPostsV2Props = {
  isMobile?: boolean;
  initialFilterState?: Record<string, any>;
};

export default function ListPostsV2({ isMobile = false, initialFilterState }: ListPostsV2Props): React.ReactElement {
  return (
    <PostsListProvider isMobile={isMobile}>
      {isMobile ? <Mobile initialFilterState={initialFilterState} /> : <Desktop initialFilterState={initialFilterState} />}
    </PostsListProvider>
  );
}
