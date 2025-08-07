/**
 * Polyfills for server-side rendering compatibility
 * This file should be imported at the very top of the app to ensure
 * browser globals are available in Node.js environment
 */

// Polyfill for 'self' global variable
if (typeof globalThis !== 'undefined' && typeof globalThis.self === 'undefined') {
  // Use type assertion to avoid TypeScript errors during polyfill
  (globalThis as any).self = globalThis;
}

// Additional polyfills for other browser globals if needed
if (typeof global !== 'undefined') {
  if (typeof (global as any).self === 'undefined') {
    (global as any).self = global;
  }

  // Polyfill window if needed (for some libraries)
  if (typeof (global as any).window === 'undefined' && typeof window === 'undefined') {
    // Don't actually create window, just prevent errors
    (global as any).window = undefined;
  }
}

export { };
