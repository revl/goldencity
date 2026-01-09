# Install production runtime dependencies
FROM node:25-alpine AS runtime-deps
RUN npm install -g --force corepack && corepack enable
COPY packages/contracts-goldencity/package.json /workdir/packages/contracts-goldencity/
COPY packages/goldencity-utils-node/package.json /workdir/packages/goldencity-utils-node/
COPY apps/goldencity-api/package.json /workdir/apps/goldencity-api/
COPY apps/goldencity-web/package.json /workdir/apps/goldencity-web/
COPY package.json yarn.lock .yarnrc.yml /workdir/
WORKDIR /workdir
RUN yarn workspaces focus --all --production

# Add development dependencies to the production dependencies environment
FROM runtime-deps AS dev-deps
WORKDIR /workdir
RUN yarn install --immutable

# Build the application
FROM dev-deps AS yarn-build
COPY package.json yarn.lock .yarnrc.yml tsconfig.json /workdir/
COPY packages /workdir/packages
COPY apps/goldencity-web /workdir/apps/goldencity-web
WORKDIR /workdir
RUN yarn workspace @goldencity/contracts build
RUN yarn workspace @goldencity/web build

# Shrinkwrap the dependencies
FROM runtime-deps AS yarn-modules
WORKDIR /workdir
RUN yarn workspaces focus @goldencity/web --production

# Build the application image
FROM node:25-alpine

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S -D -H -u 1001 -s /sbin/nologin -G appuser appuser
COPY --from=yarn-modules /workdir/node_modules/ /app/node_modules/
COPY --from=yarn-build /workdir/apps/goldencity-web/package.json /app/
COPY --from=yarn-build /workdir/apps/goldencity-web/build/ /app/build/

USER appuser

ENV HOME=/app
ENV NODE_ENV=production
ENV API_SERVER_URL=https://goldencity-api-ymzw2sanaa-uc.a.run.app

CMD ["node", "node_modules/@react-router/serve/dist/cli.js", "./build/server/index.js"]
