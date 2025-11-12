"use client";

import React from "react";
import { PostsListProvider } from "./context/PostsListProvider";
import Desktop from "./views/Desktop";
import Mobile from "./views/Mobile";
import { useCleanFilterStates } from "@app/(frontend)/_components/features/search/filters-v2/hooks/useCleanFilterStates";

export default function ListPostsV2({ isMobile = false }): React.ReactElement {
  useCleanFilterStates();

  return (
    <PostsListProvider isMobile={isMobile}>
      {isMobile ? <Mobile /> : <Desktop />}
    </PostsListProvider>
  );
}
