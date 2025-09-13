# Recommended Structure Refactor Example

## Current Structure Problems

- Route handlers in `src/app/` are thin and just import from `src/views/`
- Implementation details scattered across `src/views/`, `src/mobile/`, `src/components/`
- Hard to navigate between route definition and implementation
- Unclear feature boundaries

## Recommended: Feature-Based Co-location

### Before (Current)

```
src/app/(frontend)/page.tsx                    # Just imports from views
src/views/home/HomeDesktop.tsx                 # Desktop implementation
src/mobile/home/HomeMobile.tsx                 # Mobile implementation
src/views/home/components/                     # Feature components
src/views/home/hooks/                          # Feature hooks
```

### After (Recommended)

```
src/app/(frontend)/
├── page.tsx                                   # Route handler only
└── _components/                               # Private folder (not routed)
    └── HomePage/
        ├── index.tsx                          # Main component export
        ├── HomeDesktop.tsx                    # Desktop implementation
        ├── HomeMobile.tsx                     # Mobile implementation
        ├── components/                        # Feature-specific components
        │   ├── ProductCard.tsx
        │   ├── FilterChip.tsx
        │   └── PostList.tsx
        ├── hooks/                             # Feature-specific hooks
        │   ├── useCardAuthors.ts
        │   └── useTopAuthors.ts
        └── styles/                            # Feature-specific styles
            └── HomePage.module.scss
```

## Migration Strategy

### Step 1: Create new structure alongside existing

1. Create `src/app/(frontend)/_components/HomePage/` folder
2. Move and refactor components gradually
3. Update imports in page.tsx
4. Test each migration step

### Step 2: Migrate other features

1. Post detail: `src/app/(frontend)/post/[...slug]/_components/PostDetail/`
2. Profile: `src/app/(frontend)/profile/[...slug]/_components/ProfileDetail/`
3. Category: `src/app/(frontend)/category/[...slug]/_components/CategoryPage/`

### Step 3: Clean up old structure

1. Remove empty folders from `src/views/`
2. Update import paths throughout codebase
3. Update build tools and linting rules

## Benefits of This Approach

### ✅ Improved Developer Experience

- **Co-location**: Route handler and implementation in same folder tree
- **Easy Navigation**: Jump between related files quickly
- **Clear Boundaries**: Each feature is self-contained
- **Intuitive Structure**: Follows Next.js conventions

### ✅ Better Maintainability

- **Feature Isolation**: Changes to one feature don't affect others
- **Easier Refactoring**: All related code is together
- **Clear Dependencies**: Import paths show feature relationships
- **Reduced Cognitive Load**: Less mental mapping between folders

### ✅ Scalability

- **Team Collaboration**: Different teams can own different features
- **Code Splitting**: Natural boundaries for lazy loading
- **Testing**: Feature-specific test files alongside implementation
- **Documentation**: Feature-specific README files

## Implementation Example

### New page.tsx (Route Handler Only)

```tsx
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import HomePage from './_components/HomePage';

export default async function Page() {
  const { isMobile } = await getUserAgentInfo();
  return <HomePage isMobile={isMobile} />;
}
```

### New HomePage/index.tsx (Main Component)

```tsx
import HomeDesktop from './HomeDesktop';
import HomeMobile from './HomeMobile';

interface HomePageProps {
  isMobile: boolean;
}

export default function HomePage({ isMobile }: HomePageProps) {
  return isMobile ? <HomeMobile /> : <HomeDesktop />;
}
```

This structure makes it much easier to:

- Find all code related to a specific page/feature
- Navigate between route definition and implementation
- Understand feature boundaries and dependencies
- Onboard new developers
- Maintain and refactor code
