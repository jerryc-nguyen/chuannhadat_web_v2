"use client";

import React from "react";
import { PostsListProvider } from "../context/PostsListProvider";
import Desktop from "../views/Desktop";

export default function ListPostsContainer(): React.ReactElement {
  return (
    <PostsListProvider>
      <Desktop />
    </PostsListProvider>
  );
}
