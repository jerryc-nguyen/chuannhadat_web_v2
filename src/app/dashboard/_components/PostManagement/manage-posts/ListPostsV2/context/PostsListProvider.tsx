import React, { createContext, useContext } from "react";
import { usePostsListController } from "../controller/usePostsListController";
import { postsColumns } from "../components/table/columns";
import { FormProvider } from "react-hook-form";

const PostsListContext = createContext<any>(null);

export function PostsListProvider({ children }: { children: React.ReactNode }) {
  const ctl = usePostsListController({ columns: postsColumns });
  return (
    <PostsListContext.Provider value={ctl}>
      <FormProvider {...ctl.formMethods}>
        {children}
      </FormProvider>
    </PostsListContext.Provider>
  );
}

export function usePostsListContext() {
  const context = useContext(PostsListContext);
  if (!context) {
    throw new Error("usePostsListContext must be used within a PostsListProvider");
  }
  return context;
}
