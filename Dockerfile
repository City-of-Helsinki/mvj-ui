# ===============================================
FROM registry.access.redhat.com/ubi9/nodejs-24 AS appbase
# ===============================================

WORKDIR /app
# Copy package and lock files (root and all workspaces so Yarn installs workspace deps)
COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/leasing/package.json apps/leasing/
COPY apps/landuse/package.json apps/landuse/

RUN npm install -g corepack
# Set yarn version and fix /app ownership so default user can write
USER root
RUN chown -R default:root /app
RUN corepack enable

USER default
# Yarn version is read from "packageManager" in package.json
RUN corepack install
RUN yarn --version

# Install exact versions of dependencies and clean cache.
# Engine restrictions for HDS 5.2.0 are suppressed via ignoredErrors in .yarnrc.yml.
RUN yarn install --immutable && yarn cache clean

# ===================================
FROM appbase AS staticbuilder
# ===================================

# Print Node.js version
RUN node --version

COPY --chown=default:root . /app

RUN yarn build

# =============================
FROM registry.access.redhat.com/ubi9/nginx-120 AS production
# =============================

USER root

# Remove default NGINX files
RUN rm -rf /usr/share/nginx/html/*

RUN chgrp -R 0 /usr/share/nginx/html && \
    chmod -R g=u /usr/share/nginx/html

USER default

# Copy static build
COPY --from=staticbuilder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY .prod/nginx.conf /etc/nginx/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
