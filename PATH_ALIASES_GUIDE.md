# 🎯 New Path Aliases Guide

## ✅ Added New Path Aliases

I've added clean path aliases to make imports much easier in your new structure:

### 📁 **New Aliases in `tsconfig.json`**

```json
{
  "paths": {
    // ... existing aliases ...
    "@frontend/*": ["src/app/(frontend)/_components/*"],
    "@dashboard/*": ["src/app/dashboard/_components/*"],
    "@common/*": ["src/common/*"]
  }
}
```

## 🚀 **How to Use the New Aliases**

### **Before (Messy Relative Imports)**

```tsx
// ❌ Hard to read and maintain
import PostDetail from '../../../post/[...slug]/_components/PostDetail';
import HomePage from '../../_components/HomePage';
import { useLoadMissingAuthors } from '../../../_components/HomePage/hooks/useLoadMissingAuthors';
```

### **After (Clean Alias Imports)**

```tsx
// ✅ Clean and easy to understand
import PostDetail from '@frontend/PostDetail';
import HomePage from '@frontend/HomePage';
import { useLoadMissingAuthors } from '@frontend/HomePage/hooks/useLoadMissingAuthors';
```

## 📋 **Alias Examples for Your Structure**

### **Frontend Components**

```tsx
// HomePage feature
import HomePage from '@frontend/HomePage';
import { useCardAuthors } from '@frontend/HomePage/hooks/useCardAuthors';
import { loadedCardAuthorsAtom } from '@frontend/HomePage/states';

// PostDetail feature
import PostDetail from '@frontend/PostDetail';
import { postDetailAtom } from '@frontend/PostDetail/states/postDetailAtoms';
import useModalPostDetail from '@frontend/PostDetail/hooks/useModalPostDetail';

// ProfileDetail feature
import ProfileDetail from '@frontend/ProfileDetail';
import ProfileImage from '@frontend/ProfileDetail/components/ProfileImage';

// NewsPage feature
import NewsPage from '@frontend/NewsPage';
import NewsDesktop from '@frontend/NewsPage/NewsDesktop';
```

### **Dashboard Components (Future)**

```tsx
// When you migrate dashboard
import DashboardLayout from '@dashboard/Layout';
import PostsManager from '@dashboard/PostsManager';
import BalanceManager from '@dashboard/BalanceManager';
```

### **Cross-Feature Imports**

```tsx
// HomePage importing from PostDetail
import { modalPostDetailAtoms } from '@app/(frontend)/post/[...slug]/_components/PostDetail/states/modalPostDetailAtoms';

// Or even cleaner with a specific alias:
import { modalPostDetailAtoms } from '@frontend/../post/[...slug]/_components/PostDetail/states/modalPostDetailAtoms';
```

## 🔧 **Updating Existing Imports**

### **Current Import Issues Fixed**

1. **ProductCard.tsx** - Fixed the complex relative import:

   ```tsx
   // Before
   import { isLoadingModal } from '../../../post/[...slug]/_components/PostDetail/states/modalPostDetailAtoms';

   // After
   import { isLoadingModal } from '@app/(frontend)/post/[...slug]/_components/PostDetail/states/modalPostDetailAtoms';
   ```

2. **Type Issues** - Using the global `A` type from `next-global.d.ts`:
   ```tsx
   // Now you can use the global A type anywhere
   interface Props {
     data: A; // ✅ Works globally
     filterParams: A; // ✅ Works globally
   }
   ```

## 🎨 **Benefits of New Aliases**

### ✅ **Cleaner Imports**

- No more `../../../` relative path hell
- Clear indication of where components come from
- Easier to refactor and move files

### ✅ **Better Developer Experience**

- IDE autocomplete works better with aliases
- Easier to understand component relationships
- Faster navigation between files

### ✅ **Maintainable Code**

- Imports don't break when you move files around
- Clear separation between frontend and dashboard
- Consistent import patterns across the codebase

## 📝 **Recommended Import Patterns**

### **Within Same Feature**

```tsx
// Use relative imports for same feature
import { useCardAuthors } from './hooks/useCardAuthors';
import { loadedCardAuthorsAtom } from '../states';
```

### **Cross-Feature Imports**

```tsx
// Use aliases for cross-feature imports
import { postDetailAtom } from '@app/(frontend)/post/[...slug]/_components/PostDetail/states/postDetailAtoms';
```

### **Shared Components**

```tsx
// Continue using existing aliases for shared components
import { Button } from '@components/ui/button';
import { useQueryPosts } from '@hooks/useQueryPosts';
import { services } from '@api/services';
```

## 🚀 **Next Steps**

1. **Update Remaining Imports**: Gradually replace complex relative imports with aliases
2. **IDE Configuration**: Your IDE should automatically pick up the new aliases
3. **Team Guidelines**: Share this pattern with your team for consistency

The new aliases make your codebase much more navigable and maintainable! 🎉
