"use client";

import React from "react";
import { PostsListProvider } from "./context/PostsListProvider";
import Desktop from "./views/Desktop";
import Mobile from "./views/Mobile";

export default function ListPostsV2({ isMobile = false }): React.ReactElement {
  return (
    <PostsListProvider>
      {isMobile ? <Mobile /> : <Desktop />}
    </PostsListProvider>
  );
}
