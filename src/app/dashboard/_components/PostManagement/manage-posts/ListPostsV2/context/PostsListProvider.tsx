import React, { createContext, useContext } from "react";
import { usePostsListController } from "../controller/usePostsListController";
import { desktopColumns, mobileColumns } from "../components/table/columns";
import { FormProvider } from "react-hook-form";

const PostsListContext = createContext<any>(null);

type Props = { children: React.ReactNode; isMobile?: boolean };

export function PostsListProvider({ children, isMobile = false }: Props) {
  const columns = isMobile ? mobileColumns : desktopColumns;
  const ctl = usePostsListController({ columns });
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
