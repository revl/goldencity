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
COPY packages/contracts-goldencity /workdir/packages/contracts-goldencity
COPY packages/goldencity-utils-node /workdir/packages/goldencity-utils-node
COPY apps/goldencity-api /workdir/apps/goldencity-api
COPY scripts/patch_packages_for_server_build.js /workdir/scripts/patch_packages_for_server_build.js
WORKDIR /workdir
# Change the main and types fields in the package.json of the shared workspaces
# to point to the compiled output, so that dependent workspace (the API server)
# can resolve them correctly.
RUN node scripts/patch_packages_for_server_build.js
# Build shared workspace dependencies **before** the API server so Yarn's
# workspace symlink (e.g. node_modules/@incubator/contracts,
# which points to ../../packages/contracts-shared) resolves to the real compiled
# output in the final image.
RUN yarn workspace @goldencity/contracts build
RUN yarn workspace @goldencity/utils-node build
RUN yarn workspace @goldencity/api build

# Shrinkwrap the dependencies
FROM runtime-deps AS yarn-modules
WORKDIR /workdir
RUN yarn workspaces focus @goldencity/api --production

# Build the application image
FROM node:25-alpine

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S -D -H -u 1001 -s /sbin/nologin -G appuser appuser

COPY --from=yarn-modules /workdir/node_modules/ /app/node_modules/
COPY --from=yarn-build /workdir/apps/goldencity-api/package.json /app/
COPY --from=yarn-build /workdir/apps/goldencity-api/dist/ /app/dist/
# Preserve the workspace target that node_modules symlinks to; without this,
# the symlink created by `yarn workspaces focus` would dangle at runtime.
COPY --from=yarn-build /workdir/packages/contracts-goldencity/package.json /app/packages/contracts-goldencity/
COPY --from=yarn-build /workdir/packages/contracts-goldencity/dist/ /app/packages/contracts-goldencity/dist/
COPY --from=yarn-build /workdir/packages/goldencity-utils-node/package.json /app/packages/goldencity-utils-node/
COPY --from=yarn-build /workdir/packages/goldencity-utils-node/dist/ /app/packages/goldencity-utils-node/dist/

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3001

ENV HOME=/app
ENV NODE_ENV=production
ENV CORS_ORIGINS=https://goldencity-244940938554.us-central1.run.app,https://goldencity-ymzw2sanaa-uc.a.run.app

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["node", "dist/index.js"]
