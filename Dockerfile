FROM node:20-alpine AS base


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Set memory limit for Node.js during build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1
# Disable source maps to speed up the build
ENV GENERATE_SOURCEMAP=false

# Copy package.json and package-lock.json before other files
COPY package.json package-lock.json ./
RUN npm install

# Copy app configuration files first to leverage caching
COPY next.config.mjs tsconfig.json tsconfig.paths.json postcss.config.mjs tailwind.config.ts next-env.d.ts next-global.d.ts components.json .eslintrc.json .prettierrc* ./
COPY public ./public

# Copy sentry configuration if needed
COPY sentry*.config.ts ./

# Copy source code
COPY src ./src

# Copy ecosystem config
COPY ecosystem.config.js ./

# Copy remaining files (if any)
COPY . .

# Remove local environment variables
RUN rm -rf .env.local

# Use production mode for the build - simple and effective
RUN NODE_ENV=production npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV GENERATE_SOURCEMAP=false
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_TELEMETRY_DISABLED=1

# Install PM2 globally
RUN npm install -g pm2

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/ecosystem.config.js ./ecosystem.config.js

# Create log directory and set permissions
RUN mkdir -p logs && chown nextjs:nodejs logs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 4500

ENV PORT 4500
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# Use PM2 to start the server with clustering and auto-restart
CMD ["pm2-runtime", "ecosystem.config.js"]
