FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@11.8.0 --activate

WORKDIR /app

# Workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/ai/package.json ./apps/ai/
COPY packages/db/package.json ./packages/db/

# Install only web dependencies
RUN pnpm install --frozen-lockfile --filter @karmaOS/web

# Copy web source + config
COPY apps/web ./apps/web

WORKDIR /app/apps/web

# Build production bundle
RUN pnpm build

EXPOSE 3000

ENV HOSTNAME=0.0.0.0

CMD ["pnpm", "start"]