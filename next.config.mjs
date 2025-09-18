import bundleAnalyzer from '@next/bundle-analyzer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable parallel compilation for faster builds
    webVitalsAttribution: ['CLS', 'LCP'],
    // Faster CSS processing
    optimizeCss: true,
    // ✅ CRITICAL FOR PAGESPEED: Enable modern CSS optimization
    cssChunking: true, // Better CSS chunk management
    // Enable app router optimizations
    appDir: true,
  },

  // Reduce memory usage during build
  generateEtags: false,

  // ✅ PAGESPEED OPTIMIZATIONS
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header for security

  // Enable static optimization
  trailingSlash: false,

  // Optimize compilation
  compiler: {
    // Remove console logs in production for faster builds, but keep debug logs when DEBUG flags are set
    removeConsole:
      process.env.NODE_ENV === 'production' && !process.env.DEBUG_MIDDLEWARE
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },
  turbopack: {
    resolveAlias: {
      underscore: 'lodash',
    },
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_ASSET_PREFIX : '',
  sassOptions: {
    additionalData: `@use "src/styles/variables/_index.scss" as *; `,
  },
  images: {
    // Keep unoptimized since you have your own image resizing service
    // Your custom resizer with quality control is better for cost management
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.chuannhadat.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.chuannhadat.com',
      },
      {
        protocol: 'https',
        hostname: '**.**.com',
      },
      {
        protocol: 'https',
        hostname: 'chuannhadat.com',
      },
      {
        protocol: 'https',
        hostname: 'chuannhadat-assets.sgp1.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'chuannhadat-assets-dev.sgp1.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'chuannhadat-assets-resized.b-cdn.net',
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: '/robots.txt',
        destination: '/api/seo_proxy/robots.txt',
      },
      {
        source: '/:path*.xml',
        destination: '/api/seo_proxy/:path*.xml',
      },
      {
        source: '/:path*.xml.gz',
        destination: '/api/seo_proxy/:path*.xml.gz',
      },
    ];
  },

  // Webpack optimizations for faster builds
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      // Enable persistent caching
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };

      // Simplified chunk splitting to prevent webpack runtime issues
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 500000, // Larger max size to prevent over-fragmentation
        cacheGroups: {
          // Essential framework chunk
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: 'framework',
            chunks: 'all',
            priority: 50,
            enforce: true,
          },
          // Core vendor libraries
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }

    // Development optimizations for faster rebuilds
    if (dev) {
      config.devtool = 'eval-cheap-module-source-map';
      config.optimization.removeAvailableModules = false;
      config.optimization.removeEmptyChunks = false;
      config.optimization.splitChunks = false;
    }

    // General optimizations
    config.resolve.symlinks = false;
    config.resolve.cache = true;

    // Exclude heavy modules from server bundle when possible
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    }

    // Exclude dev-only packages from production bundle
    if (!dev) {
      // Properly handle externals array
      if (Array.isArray(config.externals)) {
        config.externals.push('@tanstack/react-query-devtools');
      } else {
        config.externals = [...(config.externals || []), '@tanstack/react-query-devtools'];
      }
    }

    // Add polyfill for 'self' variable to prevent SSR errors
    if (config.isServer) {
      // More comprehensive polyfill for server-side rendering
      const defineGlobal = (name, value) => {
        try {
          if (typeof global[name] === 'undefined') {
            Object.defineProperty(global, name, {
              value: value,
              writable: true,
              enumerable: false,
              configurable: true,
            });
          }
        } catch (e) {
          // Fallback for older Node.js versions
          global[name] = value;
        }
      };

      defineGlobal('self', global);
      defineGlobal('window', undefined);
      defineGlobal('document', undefined);
      defineGlobal('navigator', undefined);
    }

    return config;
  },

  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx', 'node.js'],
  output: 'standalone',
};

export default withBundleAnalyzer(nextConfig);
