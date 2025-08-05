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
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Production optimizations
    if (!dev) {
      // Enable persistent caching
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };

      // Optimize bundle splitting for faster builds
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix',
            chunks: 'all',
            priority: 15,
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
