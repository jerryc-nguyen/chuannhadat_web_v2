// Apply polyfills immediately before any other imports
if (typeof global.self === 'undefined') {
  global.self = global;
}
if (typeof global.window === 'undefined') {
  global.window = undefined;
}
if (typeof global.document === 'undefined') {
  global.document = undefined;
}
if (typeof global.navigator === 'undefined') {
  global.navigator = undefined;
}

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '4500', 10);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Prepare the app
app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      // Parse the URL
      const parsedUrl = parse(req.url, true);

      // Let Next.js handle the request
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Configure server error handling
  server.on('error', (err) => {
    console.error('Server error:', err);
  });

  // Start listening
  server.listen(port, hostname, (err) => {
    if (err) throw err;

    // Log startup info
    console.log(`> Ready on http://${hostname}:${port}`);

    // Send ready signal to PM2
    if (typeof process.send === 'function') {
      process.send('ready');
      console.log('Sent ready signal to PM2');
    }
  });

  // Handle graceful shutdown
  const signals = ['SIGTERM', 'SIGINT'];
  signals.forEach((signal) => {
    process.on(signal, () => {
      console.log(`Received ${signal}, closing server...`);
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });

      // Force close after 30s
      setTimeout(() => {
        console.error('Forcing server shutdown after timeout');
        process.exit(1);
      }, 30000);
    });
  });
});
