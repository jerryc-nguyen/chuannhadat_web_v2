module.exports = {
  apps: [
    {
      name: 'chuannhadat-web',
      script: 'src/server.js',
      instances: 'max', // Use max to leverage all available CPUs
      exec_mode: 'cluster', // Use cluster mode for load balancing across instances
      autorestart: true, // Auto restart if app crashes
      watch: false, // Don't watch for file changes in production
      max_memory_restart: '4G', // Restart if memory exceeds 4GB
      exp_backoff_restart_delay: 100, // Restart with exponential backoff
      env: {
        NODE_ENV: 'production',
        PORT: 4500,
      },
      // Logs configuration
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      // Better memory usage monitoring
      node_args: [
        '--max-old-space-size=4096', // Set max heap size to 4GB
        '--expose-gc', // Expose garbage collector for PM2 monitoring
        '--require',
        './polyfill-globals.js', // Load polyfills before any other code
      ],
      // Health check
      status_check_period: 10000, // Check app status every 10 seconds
      wait_ready: true, // Wait for app to send 'ready' signal
      listen_timeout: 30000, // Give app 30s to listen
    },
  ],
};
