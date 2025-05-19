#!/usr/bin/env node

/**
 * Feature-Driven Development Structure Generator
 *
 * This script creates a new feature with the recommended folder structure:
 * - components: Components specific to the feature
 * - hooks: Custom hooks for the feature
 * - types: TypeScript types for the feature
 * - constants: Constants used in the feature
 * - states: State management for the feature
 * - apis: API functions for the feature
 * - query: React Query implementations
 *
 * Usage: node scripts/create-feature.js my-feature-name
 */

const fs = require('fs');
const path = require('path');

const featureName = process.argv[2];

if (!featureName) {
  console.error('Please provide a feature name (in kebab-case)');
  console.error('Example: node scripts/create-feature.js my-feature-name');
  process.exit(1);
}

// Validate feature name (should be kebab-case)
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(featureName)) {
  console.error('Feature name should be in kebab-case (e.g., my-feature-name)');
  process.exit(1);
}

const featureDir = path.join(__dirname, '../src/views', featureName);

// Create feature directory if it doesn't exist
if (!fs.existsSync(featureDir)) {
  fs.mkdirSync(featureDir, { recursive: true });
  console.log(`Created feature directory: ${featureDir}`);
} else {
  console.log(`Feature directory already exists: ${featureDir}`);
}

// Define subdirectories to create
const subdirectories = ['components', 'hooks', 'types', 'constants', 'states', 'apis', 'query'];

// Create subdirectories
for (const subdir of subdirectories) {
  const subdirPath = path.join(featureDir, subdir);
  if (!fs.existsSync(subdirPath)) {
    fs.mkdirSync(subdirPath, { recursive: true });

    // Create index.ts file in each subdirectory
    const indexFilePath = path.join(subdirPath, 'index.ts');
    fs.writeFileSync(indexFilePath, `// ${featureName}/${subdir} exports\n`);

    console.log(`Created ${subdir} directory with index.ts`);
  }
}

// Create main index.ts file
const mainIndexPath = path.join(featureDir, 'index.ts');
const mainIndexContent = `// ${featureName} feature exports
export * from './components';
export * from './hooks';
export * from './types';
`;

fs.writeFileSync(mainIndexPath, mainIndexContent);
console.log(`Created main index.ts file`);

// Create README.md with information about the feature
const readmePath = path.join(featureDir, 'README.md');
const readmeContent = `# ${featureName}

## Structure
This feature follows the Feature-Driven Development pattern:

- \`components/\`: UI components specific to this feature
- \`hooks/\`: Custom React hooks for this feature
- \`types/\`: TypeScript types and interfaces
- \`constants/\`: Constants used throughout the feature
- \`states/\`: State management (Redux, Zustand, etc.)
- \`apis/\`: API service functions
- \`query/\`: React Query implementations

## Usage
Import and use components and hooks from this feature:

\`\`\`tsx
import { SomeComponent } from '@/views/${featureName}';
import { useSomeHook } from '@/views/${featureName}/hooks';
\`\`\`

## Notes
- Keep components specific to this feature in the components directory
- Reusable components that may be used across features should be moved to \`src/components\`
- Same applies to hooks and other shared utilities
`;

fs.writeFileSync(readmePath, readmeContent);
console.log(`Created README.md with feature documentation`);

// Success message
console.log(`
✅ Successfully created feature: ${featureName}

Feature location: ${featureDir}

Structure:
${subdirectories.map((dir) => `- ${dir}/`).join('\n')}
- index.ts
- README.md

Happy coding! 🚀
`);
