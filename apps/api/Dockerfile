FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@11.8.0 --activate

WORKDIR /app

# Workspace manifests (pnpm needs these for install)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/ai/package.json ./apps/ai/
COPY packages/db/package.json ./packages/db/

# Install only api dependencies
RUN pnpm install --frozen-lockfile --filter @karmaOS/api

# Copy api source
COPY apps/api ./apps/api

WORKDIR /app/apps/api

# Compile TypeScript
RUN pnpm build

EXPOSE 3001

CMD ["pnpm", "start"]