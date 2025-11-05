# ListPostsV2 Form Context Flow

This document explains how form state and context are managed in ListPostsV2 using a generic controller and FormProvider from react-hook-form.

## Overview

- The controller (`ctl`) is created via `usePostsListController`, which wraps a generic controller (`useListController`).
- The controller exposes `formMethods`, which is the object returned by `useForm` from react-hook-form.
- `PostsListProvider` wraps its children with both a custom context provider and `FormProvider`, passing `{...ctl.formMethods}`.
- This enables any child component to access form state and methods via `useFormContext()`.

## Flow Diagram

```
ListPostsContainer
  └─ PostsListProvider
       ├─ Creates ctl via usePostsListController
       ├─ <PostsListContext.Provider value={ctl}>
       │     └─ <FormProvider {...ctl.formMethods}>
       │           └─ children (Desktop, FilterBar, etc.)
```

## Why Pass formMethods to FormProvider?

- `FormProvider` expects the form methods object as props.
- This establishes a React context for the form, allowing descendants to use `useFormContext()`.
- Avoids prop drilling and ensures form state is available anywhere in the subtree.
- If omitted, `useFormContext()` will return `null`, causing runtime errors.

## Example Usage

```tsx
export function PostsListProvider({ children }: { children: React.ReactNode }) {
  const ctl = usePostsListController({ columns: postsColumns });
  return (
    <PostsListContext.Provider value={ctl}>
      <FormProvider {...ctl.formMethods}>{children}</FormProvider>
    </PostsListContext.Provider>
  );
}
```

## Accessing Form State in Children

Any child component can use:

```tsx
import { useFormContext } from 'react-hook-form';
const form = useFormContext();
```

## Summary Table

| Step                | What Happens                                  | Why Important               |
| ------------------- | --------------------------------------------- | --------------------------- |
| Controller creation | `ctl` gets `formMethods` from `useForm`       | Centralizes form logic      |
| Context wrapping    | Pass `{...ctl.formMethods}` to `FormProvider` | Enables form context access |
| Documentation       | Explain flow and pattern in `/docs`           | Ensures maintainability     |

## Best Practices

- Always wrap list/table views with `FormProvider` using the controller's form methods.
- Document this pattern for future contributors.
- Use `useFormContext()` in child components to access form state.
