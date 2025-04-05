# ---- Base Node ----
FROM node:18-slim AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
# Install client dependencies
COPY client/package.json client/package-lock.json* ./client/
RUN cd client && npm install
# Install server dependencies
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install

# ---- Build Client ----
FROM deps AS build-client
WORKDIR /app/client
COPY client ./
RUN npm run build

# ---- Build Server ----
FROM deps AS build-server
WORKDIR /app/server
COPY server ./
# Ensure all dependencies, including devDependencies with types, are installed
RUN npm install
# Rename .mjs to .ts before building
RUN mv dari-api.mjs index.ts
# Clean previous build output
RUN rm -rf dist
# -- Diagnostic Step --
RUN echo "--- Contents of /app/server before build ---"
RUN ls -la
RUN echo "--- First 20 lines of index.ts before build ---"
RUN head -n 20 index.ts
RUN echo "--- End Diagnostic --- "
# -- End Diagnostic Step --
RUN npm run build

# ---- Final Stage ----
FROM node:18-slim AS final

# Create a non-root user
ARG USERNAME=appuser
ARG USER_UID=1001
ARG USER_GID=1001
RUN groupadd --gid $USER_GID $USERNAME && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8003

# Install only production server dependencies
COPY --chown=appuser:appuser server/package.json server/package-lock.json* ./server/
RUN cd server && npm install --omit=dev

# Copy built artifacts
COPY --chown=appuser:appuser --from=build-server /app/server/dist ./server/dist
COPY --chown=appuser:appuser --from=build-client /app/client/dist ./client/dist

# Expose the port
EXPOSE 8003

# Switch to non-root user
USER $USERNAME

# Command to run the production server using the package.json script
CMD ["npm", "start", "--prefix", "server"]