import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This is crucial for Node.js runtime in middleware
  },
  turbopack: {
    resolveAlias: {
      underscore: 'lodash',
      resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
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
export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
