# Complete Migration Script

## What We've Migrated So Far

### ✅ Completed Migrations

1. **HomePage** → `src/app/(frontend)/_components/HomePage/`
2. **PostDetail** → `src/app/(frontend)/post/[...slug]/_components/PostDetail/`
3. **ProfileDetail** → `src/app/(frontend)/profile/[...slug]/_components/ProfileDetail/`
4. **CategoryPage** → Uses HomePage component (already updated)
5. **NewsPage** → `src/app/(frontend)/tin-tuc/_components/NewsPage/`

### 📋 Remaining Tasks

1. **Update Import Paths** - Find and replace old import paths
2. **Clean Up Old Structure** - Remove empty folders
3. **Test All Routes** - Ensure everything works

## Import Path Updates Needed

### Find and Replace Operations

Run these commands to update import paths throughout the codebase:

```bash
# Update HomePage imports
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@views/home/HomeDesktop|@app/(frontend)/_components/HomePage/HomeDesktop|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@mobile/home/HomeMobile|@app/(frontend)/_components/HomePage/HomeMobile|g'

# Update PostDetail imports
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@views/post-detail|@app/(frontend)/post/[...slug]/_components/PostDetail/PostDetailDesktop|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@mobile/post-detail/PostDetailMobile|@app/(frontend)/post/[...slug]/_components/PostDetail/PostDetailMobile|g'

# Update ProfileDetail imports
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@views/profile-detail|@app/(frontend)/profile/[...slug]/_components/ProfileDetail/ProfileDetailDesktop|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@mobile/profile-detail|@app/(frontend)/profile/[...slug]/_components/ProfileDetail/ProfileDetailMobile|g'

# Update News imports
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@views/news|@app/(frontend)/tin-tuc/_components/NewsPage/NewsDesktop|g'
```

## New Structure Overview

```
src/app/(frontend)/
├── page.tsx                                    # HomePage route
├── _components/
│   └── HomePage/                               # HomePage feature
│       ├── index.tsx
│       ├── HomeDesktop.tsx
│       ├── HomeMobile.tsx
│       ├── components/
│       └── hooks/
│
├── post/[...slug]/
│   ├── page.tsx                                # PostDetail route
│   └── _components/
│       └── PostDetail/                         # PostDetail feature
│           ├── index.tsx
│           ├── PostDetailDesktop.tsx
│           ├── PostDetailMobile.tsx
│           ├── components/
│           ├── hooks/
│           ├── states/
│           └── styles/
│
├── profile/[...slug]/
│   ├── page.tsx                                # ProfileDetail route
│   └── _components/
│       └── ProfileDetail/                      # ProfileDetail feature
│           ├── index.tsx
│           ├── ProfileDetailDesktop.tsx
│           ├── ProfileDetailMobile.tsx
│           ├── components/
│           └── styles/
│
├── category/[...slug]/
│   └── page.tsx                                # Uses HomePage component
│
└── tin-tuc/
    ├── page.tsx                                # NewsPage route
    ├── [slug]/
    │   └── page.tsx                            # NewsDetail route
    └── _components/
        └── NewsPage/                           # NewsPage feature
            ├── index.tsx
            ├── NewsDesktop.tsx
            ├── NewsMobile.tsx
            ├── components/
            └── mobile/
```

## Benefits Achieved

### ✅ Improved Navigation

- All route-related code is co-located
- Easy to jump between route handler and implementation
- Clear feature boundaries

### ✅ Better Organization

- Private folders (`_components`) don't create routes
- Feature-specific components are grouped together
- Shared components remain in `src/components/`

### ✅ Cleaner Imports

```tsx
// Before
import PostDetailDesktop from '@views/post-detail';
import PostDetailMobile from '@mobile/post-detail/PostDetailMobile';

// After
import PostDetail from './_components/PostDetail';
```

### ✅ Easier Maintenance

- Want to modify PostDetail? Everything is in one folder
- Want to add new PostDetail features? Add to the same folder
- Want to delete a feature? Delete one folder tree

## Next Steps

1. **Test the migrations** - Verify all routes work correctly
2. **Update remaining imports** - Use find/replace for any missed imports
3. **Clean up old folders** - Remove empty `src/views/` and `src/mobile/` folders
4. **Update build tools** - Update any build scripts that reference old paths
5. **Update documentation** - Update any docs that reference old structure

## Dashboard Migration (Separate Task)

The dashboard has a more complex structure and should be migrated separately:

- `src/views/dashboard/` → `src/app/dashboard/_components/`
- This will be a separate migration task due to its complexity

## Rollback Plan

If issues arise, you can rollback by:

1. Reverting the git changes
2. The old structure is still intact in `src/views/` and `src/mobile/`
3. Just update the route handlers to import from old locations
