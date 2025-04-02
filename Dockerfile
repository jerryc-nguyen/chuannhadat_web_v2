FROM node:20-alpine AS base


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

ENV NODE_OPTIONS=--max-old-space-size=8192
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN yarn build

# If using npm comment out above and use below instead
RUN rm -rf .env.local
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV GENERATE_SOURCEMAP=false
ENV NODE_ENV production
ENV NODE_OPTIONS=--max-old-space-size=8192
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

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
