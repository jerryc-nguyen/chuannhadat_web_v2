import { withSentryConfig } from '@sentry/nextjs';
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
  },

  // Reduce memory usage during build
  generateEtags: false,

  // Optimize compilation
  compiler: {
    // Remove console logs in production for faster builds
    removeConsole:
      process.env.NODE_ENV === 'production'
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

      // Optimize bundle splitting for smaller chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000, // ~240KB max chunk size
        cacheGroups: {
          // Split React separately (highest priority)
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 50,
          },
          // Split Firebase separately
          firebase: {
            test: /[\\/]node_modules[\\/]firebase[\\/]/,
            name: 'firebase',
            chunks: 'all',
            priority: 45,
          },
          // Split Sentry separately
          sentry: {
            test: /[\\/]node_modules[\\/]@sentry[\\/]/,
            name: 'sentry',
            chunks: 'all',
            priority: 40,
          },
          // Split TanStack Query separately
          tanstack: {
            test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
            name: 'tanstack',
            chunks: 'all',
            priority: 35,
          },
          // Split Radix UI components
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix',
            chunks: 'all',
            priority: 30,
          },

          // Split Embla Carousel (core UI component)
          embla: {
            test: /[\\/]node_modules[\\/]embla-carousel.*[\\/]/,
            name: 'embla',
            chunks: 'all',
            priority: 28,
          },
          // Split heavy UI libraries (on-demand loading)
          ui: {
            test: /[\\/]node_modules[\\/](swiper|yet-another-react-lightbox|react-confetti|vaul|@hello-pangea\/dnd|react-dropzone|react-google-recaptcha|sonner|react-day-picker|react-resizable-panels|react-paginate|cmdk)[\\/]/,
            name: 'ui-heavy',
            chunks: 'all',
            priority: 25,
          },
          // Split Radix interactive components (on-demand loading)
          radixInteractive: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]react-(dialog|dropdown-menu|context-menu|hover-card|menubar|alert-dialog|toast|collapsible|accordion)[\\/]/,
            name: 'radix-interactive',
            chunks: 'all',
            priority: 24,
          },
          // Split utilities
          utils: {
            test: /[\\/]node_modules[\\/](lodash-es|date-fns|clsx)[\\/]/,
            name: 'utils',
            chunks: 'all',
            priority: 20,
          },
          // Default vendor chunk for remaining packages
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            maxSize: 200000, // ~200KB max for remaining vendors
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
const sentryWebpackPluginOptions = {
  org: 'chuan-nha-dat',
  project: 'javascript-nextjs',
  silent: true,
  widenClientFileUpload: true,
  reactComponentAnnotation: { enabled: true },
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
};
export default withSentryConfig(withBundleAnalyzer(nextConfig), sentryWebpackPluginOptions);
