### Troubleshooting

- To view logs run `docker compose logs --tail=100 -f`
- To view the generated Nginx configuration run:
  - docker exeac -ti nginx cat /etc/nginx/conf.d/default.conf


### Find memory leak components:
```
chmod +x scripts/find-memory-leaks.sh
```

### Build web docker production

```
docker build --platform linux/x86_64 -t registry.gitlab.com/mkt-devops/web-deployments:chuannhadat_next_v2 -f Dockerfile . && docker push registry.gitlab.com/mkt-devops/web-deployments:chuannhadat_next_v2
```

### IMAGES CND NOTES

images.chuannhadat.com
-> BUNNY CDN (s3-images.b-cdn.net)
-> resizer.chuannhadat.com/s3-images
-> Prefix url: https://chuannhadat-assets.sgp1.digitaloceanspaces.com

assets.chuannhadat.com
-> BUNNY CDN (chuannhadat-files.b-cdn.net)
-> chuannhadat.com

spaces.chuannhadat.com
-> BUNNY CDN (chuannhadat-do-spaces.b-cdn.net)
-> https://chuannhadat-assets.sgp1.digitaloceanspaces.com

s3-images-dev.b-cdn.net
-> resizer.chuannhadat.com/s3-images-dev
-> Prefix url: https://chuannhadat-assets-dev.sgp1.digitaloceanspaces.com

===
component examples from this repo: https://github.com/HashenUdara/shadcn-ui-examples/tree/main
https://next-shadcn-dashboard-starter.vercel.app/dashboard/employee/new

OK

### Preventing Application Crashes

The application has been optimized to prevent crashes that previously required redeployment:

#### Docker Configuration
- Memory limits have been set to 4GB in both build and runtime environments
- Resource limits have been added to docker-compose.yml to prevent container resource starvation
- A health check endpoint was added at `/api/health` to monitor application status and auto-restart if needed

#### Memory Leak Prevention
The primary cause of crashes was likely memory leaks from improperly cleaned up event listeners, timers, or intervals.

To prevent these issues:
1. Use the `useCleanupEffect` hook from `src/hooks/useCleanupEffect.ts` instead of regular `useEffect` when:
   - Setting timers with setTimeout or setInterval
   - Adding event listeners
   - Managing subscriptions
   - Handling async operations that update state

Example usage:
```tsx
import useCleanupEffect from '@hooks/useCleanupEffect';

function MyComponent() {
  useCleanupEffect((helpers) => {
    // Safe timeout that won't cause memory leaks
    helpers.setTimeout(() => {
      console.log('This is safe');
    }, 5000);
    
    // Safe event listener that's automatically removed
    helpers.addEventListener(window, 'resize', handleResize);
    
    // Check if component is still mounted in async functions
    async function fetchData() {
      const result = await api.getData();
      if (helpers.isMounted()) {
        setData(result); // Safe to update state
      }
    }
    
    fetchData();
  }, []);
  
  return <div>My Component</div>;
}
```

#### Error Handling
- Enhanced error boundaries to provide better diagnostics
- Added detailed error logging to Sentry for monitoring
- Improved error recovery mechanism with reset functionality

#### Deployment
When deploying, make sure:
1. The Docker environment has at least 4GB of available memory
2. Health checks are properly configured
3. Environment variables are correctly set

For further troubleshooting, see the logs via:
```bash
docker compose logs --tail=100 -f
```

### Additional Stability Improvements

To further improve application stability:

1. **API Error Handling**: An enhanced axios instance has been implemented with:
   - Automatic retry for failed network requests and certain error responses (408, 429, 500, 502, 503, 504)
   - Progressive retry delay (increases with each retry attempt)
   - Detailed error logging with request duration metrics
   - Consistent error format for easier debugging
   - Request cancellation support

   ```typescript
   // You can cancel requests to prevent race conditions
   import { cancelTokenSource } from '@api/axiosInstance';
   
   const source = cancelTokenSource();
   
   // Make a cancellable request
   axiosInstance.get('/some-endpoint', { 
     cancelToken: source.token 
   });
   
   // Cancel the request if needed
   source.cancel('Operation cancelled by the user');
   ```

2. **React Query Configuration**: Add retry logic and error handling
   ```typescript
   // Example configuration
   const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         retry: 3,
         staleTime: 5 * 60 * 1000, // 5 minutes
         onError: (error) => console.error('Query error:', error),
       },
     },
   });
   ```

3. **Error Boundaries**: Wrap key sections of your application with error boundaries
   ```tsx
   <ErrorBoundary fallback={<p>Something went wrong</p>}>
     <ComponentThatMightError />
   </ErrorBoundary>
   ```

4. **Memory Monitoring**: Monitor client-side memory usage to detect issues early
   ```typescript
   // Check browser memory usage periodically
   useCleanupEffect((helpers) => {
     const checkMemory = () => {
       if ('performance' in window && 'memory' in performance) {
         const memory = performance.memory;
         if (memory.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB
           console.warn('High memory usage detected');
         }
       }
     };
     
     helpers.setInterval(checkMemory, 30000); // Every 30 seconds
   }, []);
   ```

### Using PM2 for Automatic Restarts

The application now uses PM2 to automatically restart when it crashes. PM2 is a process manager for Node.js applications that provides:

- Automatic restarts when the application crashes
- Clustering for load balancing across multiple CPU cores
- Process monitoring and logging
- Memory/CPU usage monitoring

#### PM2 Commands

These commands are available in package.json scripts:

```bash
# Start the application with PM2 in production
npm run start:pm2

# Start PM2 in development
npm run pm2:start

# Stop PM2 processes
npm run pm2:stop

# Restart PM2 processes
npm run pm2:restart

# View process status
npm run pm2:status

# View logs
npm run pm2:logs

# Monitor processes in real-time
npm run pm2:monitor
```

#### PM2 Configuration

PM2 is configured in `ecosystem.config.js` with the following features:

- **Clustering**: Utilizes all available CPU cores
- **Auto-restart**: Automatically restarts the application if it crashes
- **Memory limit**: Restarts if memory usage exceeds 4GB
- **Graceful shutdown**: Properly handles shutdown signals
- **Log management**: Stores logs in the `logs` directory

For more details on PM2, see [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/).

### Bot Protection System

The application includes a bot protection system that identifies and filters suspicious bot traffic using the following methods:

1. **Bot Detection**: Analyzes user agents, IP addresses, and request patterns to identify bots
2. **Search Engine Verification**: Verifies legitimate search engine bots through DNS lookups
3. **Request Monitoring**: Logs all requests for analysis in the dashboard

#### Edge/Node.js Runtime Compatibility

The bot protection system is designed to work safely in both Node.js and Edge runtimes:

- **Middleware (Node.js runtime)**: Uses pure JavaScript implementation without Redis dependencies
- **API Routes (Node.js runtime)**: Uses ioredis for persistent log storage
- **Log Synchronization**: Middleware logs are stored in memory and asynchronously sent to the API routes for Redis storage

#### Redis Integration for Bot Protection

Bot protection logs are stored in Redis for improved persistence and scalability:

- **Installation**: Redis is required for production use of the bot protection system
- **Configuration**: Set the `REDIS_URL` environment variable (defaults to `redis://localhost:6379/1`)
- **Fallback**: In-memory storage is used as a fallback if Redis is unavailable
- **Dashboard**: The bot protection dashboard at `/bot-protection-dashboard` shows real-time metrics

#### Environment Variables

Configure bot protection with these environment variables:

```
# Enable/disable bot protection
ENABLE_BOT_PROTECTION=true

# Redis connection string for bot logs storage
REDIS_URL=redis://redis:6379/1

# Optional API key for dashboard access (if not set, only allowed in dev)
BOT_PROTECTION_DASHBOARD_KEY=your-secure-key-here
```

#### Middleware Configuration

The bot protection system is implemented as middleware in `src/middleware/bot-protection.ts` and is triggered based on the configuration in `src/middleware/index.ts`. It can be customized to protect specific routes or exclude others as needed.
