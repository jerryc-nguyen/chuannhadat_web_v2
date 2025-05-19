# Feature-Driven Development (FDD) Structure

This project follows a Feature-Driven Development approach to organize code in a scalable and maintainable way.

## Overview

Feature-Driven Development (FDD) is a methodology where the codebase is organized around features rather than technical layers. Each feature is a self-contained module that includes all the necessary components, logic, and utilities needed to implement that feature.

## Structure

The project follows this structure:

```
src/
├── views/                        # Main features directory
│   ├── feature-one/              # Feature named using URL slug format
│   │   ├── components/           # UI components specific to this feature
│   │   ├── hooks/                # Custom React hooks for this feature
│   │   ├── types/                # TypeScript types and interfaces
│   │   ├── constants/            # Constants used in the feature
│   │   ├── states/               # State management (Redux/Zustand/etc)
│   │   ├── apis/                 # API service functions
│   │   ├── query/                # React Query implementations
│   │   └── index.ts              # Public exports from this feature
│   │
│   └── feature-two/              # Another feature
│       └── ...
│
├── app/                          # Next.js app directory
├── components/                   # Shared components used across features
├── hooks/                        # Shared hooks used across features
├── types/                        # Shared types used across features
└── common/                       # Other shared utilities
```

## Feature Naming

Features should be named following URL slug format (kebab-case). Examples:

- `main-dashboard`
- `user-profile`
- `product-listing`
- `main-financial-management`

## Creating a New Feature

To create a new feature with the correct structure, run:

```bash
npm run create:feature my-new-feature
```

This will generate a new feature directory with all the required folders and files.

## Guidelines

1. **Feature Isolation**: Each feature should be as self-contained as possible.

   - Components specific to a feature should live in that feature's components directory
   - Reusable components that are used across multiple features should be moved to the shared `src/components` directory

2. **Feature Boundaries**:

   - Features should not import directly from other features
   - Communication between features should happen through shared state or services

3. **Module Exports**:

   - Each feature should carefully export only what needs to be public through its `index.ts` file
   - Internal implementation details should not be directly importable from outside the feature

4. **Reusable Elements**:
   - If a component, hook, or utility within a feature becomes useful in multiple features, consider moving it to the appropriate shared directory

## Benefits

- **Improved Developer Experience**: Easier to navigate, understand, and work with the codebase
- **Better Scalability**: New features can be added without affecting existing ones
- **Maintainability**: Changes to one feature are less likely to affect others
- **Parallel Development**: Teams can work on different features simultaneously with minimal conflicts

## Notes

- Use relative imports within a feature
- Use absolute imports for shared utilities and components
- Follow the principle: "If it's used in multiple features, it belongs in a shared directory"

## References

- [Structuring React Projects with Feature-Driven Development](https://medium.com/@Evelyn.Taylor/structuring-react-projects-with-feature-driven-development-%EF%B8%8F-b671ee898145)
