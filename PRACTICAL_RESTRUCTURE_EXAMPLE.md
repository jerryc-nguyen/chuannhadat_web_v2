# Practical Restructure Example: HomePage Feature

## What We Just Created

I've created a practical example of the recommended structure using your actual HomePage. Here's what changed:

### Before (Current Structure)

```
src/app/(frontend)/page.tsx                    # Imports from views & mobile
src/views/home/HomeDesktop.tsx                 # Desktop implementation
src/mobile/home/HomeMobile.tsx                 # Mobile implementation
src/views/home/components/                     # Scattered components
src/views/home/hooks/                          # Scattered hooks
```

### After (New Co-located Structure)

```
src/app/(frontend)/
├── page.tsx                                   # Clean route handler
└── _components/HomePage/                      # Feature folder (private)
    ├── index.tsx                              # Main component
    ├── HomeDesktop.tsx                        # Desktop implementation
    ├── HomeMobile.tsx                         # Mobile implementation
    ├── components/                            # Feature-specific components
    │   ├── PostControls.tsx
    │   ├── PostList.tsx
    │   └── ListTopAuthor/
    └── hooks/                                 # Feature-specific hooks
        └── useLoadMissingAuthors.ts
```

## Key Changes Made

### 1. Simplified Route Handler

**File: `src/app/(frontend)/page.tsx`**

```tsx
// Before: Complex logic with device detection
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import HomeMobile from '@mobile/home/HomeMobile';
import HomeDesktop from '@views/home/HomeDesktop';

export default async function HomePage() {
  const { isMobile } = await getUserAgentInfo();
  return isMobile ? <HomeMobile /> : <HomeDesktop />;
}

// After: Clean and simple
import HomePage from './_components/HomePage';

export default function Page() {
  return <HomePage />;
}
```

### 2. Feature-Centralized Main Component

**File: `src/app/(frontend)/_components/HomePage/index.tsx`**

```tsx
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import HomeDesktop from './HomeDesktop';
import HomeMobile from './HomeMobile';

interface HomePageProps {
  isMobile?: boolean;
}

export default async function HomePage({ isMobile }: HomePageProps) {
  const userAgent = isMobile !== undefined ? { isMobile } : await getUserAgentInfo();
  return userAgent.isMobile ? <HomeMobile /> : <HomeDesktop />;
}
```

### 3. Co-located Components

- **HomeDesktop.tsx**: Moved with updated imports pointing to local components
- **HomeMobile.tsx**: Moved with updated imports pointing to local components
- **components/**: All HomePage-specific components in one place
- **hooks/**: All HomePage-specific hooks in one place

## Benefits You'll Experience

### ✅ Improved Navigation

- **Before**: Jump between `src/app/` → `src/views/` → `src/mobile/`
- **After**: Everything in `src/app/(frontend)/_components/HomePage/`

### ✅ Clear Feature Boundaries

- All HomePage code is in one folder tree
- Easy to see what belongs to this feature
- Reduced cognitive load when working on HomePage

### ✅ Better Imports

```tsx
// Before: Scattered imports
import PostControls from '@views/home/components/PostControls';
import { ListTopAuthor } from '@views/home/components/ListTopAuthor';
import useLoadMissingAuthors from '@views/home/hooks/useLoadMissingAuthors';

// After: Local imports
import PostControls from './components/PostControls';
import { ListTopAuthor } from './components/ListTopAuthor';
import useLoadMissingAuthors from './hooks/useLoadMissingAuthors';
```

### ✅ Easier Refactoring

- Want to change HomePage? Everything is in one place
- Want to add new HomePage features? Add to the same folder
- Want to delete HomePage? Delete one folder tree

## Next Steps for Full Migration

### 1. Apply Same Pattern to Other Features

```bash
# Post Detail
src/app/(frontend)/post/[...slug]/_components/PostDetail/

# Profile Detail
src/app/(frontend)/profile/[...slug]/_components/ProfileDetail/

# Category Pages
src/app/(frontend)/category/[...slug]/_components/CategoryPage/
```

### 2. Update Import Paths

- Update any external imports pointing to old locations
- Use find-and-replace for systematic updates
- Test each migration step

### 3. Clean Up Old Structure

- Remove empty folders from `src/views/`
- Remove empty folders from `src/mobile/`
- Update build tools and linting rules

## Alternative Approaches

If you prefer different organization, here are other valid patterns:

### Option A: Shared Components Folder

```
src/app/(frontend)/
├── _components/                               # Shared across routes
│   ├── HomePage/
│   ├── PostDetail/
│   └── shared/                                # Cross-feature components
└── page.tsx
```

### Option B: Domain-Driven Design

```
src/app/(frontend)/
├── _domains/                                  # Business logic
│   ├── home/
│   └── posts/
├── _ui/                                       # UI components
│   ├── HomePage/
│   └── PostDetail/
└── page.tsx
```

### Option C: Hybrid Approach

Keep some shared components in `src/components/` for truly reusable UI components, but co-locate feature-specific components.

## Recommendation

Start with the **Feature-Based Co-location** approach I've demonstrated because:

- ✅ Easiest to understand and navigate
- ✅ Follows Next.js App Router conventions
- ✅ Clear feature boundaries
- ✅ Minimal disruption to existing code
- ✅ Can be migrated incrementally

You can always refactor further once you see how it works in practice!
