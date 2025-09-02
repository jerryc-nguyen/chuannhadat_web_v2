const path = require('path');

module.exports = {
  // Only apply optimizations in production
  ...(process.env.NODE_ENV === 'production' && {
    optimization: {
      // Enable parallel compression
      minimizer: [
        '...',
        // Use SWC for faster minification instead of Terser
      ],

      // Optimize chunk splitting for faster builds
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Vendor chunk for node_modules
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Common chunk for shared components
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
          // Separate chunks for heavy libraries
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
      },
    },

    // Reduce resolve time
    resolve: {
      // Limit the number of resolve attempts
      symlinks: false,
      // Cache resolve results
      cache: true,
    },

    // Enable persistent caching for faster subsequent builds
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
      cacheDirectory: path.resolve(__dirname, '.next/cache/webpack'),
    },
  }),

  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    // Disable source maps in development for faster builds
    devtool: 'eval-cheap-module-source-map',

    // Optimize for development
    optimization: {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    },

    // Faster file watching
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/,
    },
  }),
};
