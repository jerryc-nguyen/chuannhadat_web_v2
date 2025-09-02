// Global polyfills for Node.js to prevent "self is not defined" errors
// This file should be required as early as possible in the Node.js process

// Polyfill 'self' - the most common missing global
if (typeof global.self === 'undefined') {
  global.self = global;
}

// Polyfill other common browser globals that libraries might expect
if (typeof global.window === 'undefined') {
  global.window = undefined;
}

if (typeof global.document === 'undefined') {
  global.document = undefined;
}

if (typeof global.navigator === 'undefined') {
  global.navigator = undefined;
}

// Also ensure these are available on globalThis if it exists
if (typeof globalThis !== 'undefined') {
  if (typeof globalThis.self === 'undefined') {
    globalThis.self = globalThis;
  }
}

console.log('✅ Global polyfills applied successfully');
