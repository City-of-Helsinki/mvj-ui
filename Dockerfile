# ===============================================
FROM registry.access.redhat.com/ubi9/nodejs-22 AS appbase
# ===============================================

WORKDIR /app
# Copy package and lock files
COPY package.json yarn.lock ./

# Install yarn
USER root
RUN chown -R default:root /app
RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN dnf install -y yarn

# Set Yarn version
ENV YARN_VERSION=1.22.22
RUN yarn policies set-version $YARN_VERSION

# Use non-root user
USER default
# Set node environment, either development or production
# use development to install devDependencies
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Install exact versions of dependencies and clean cache
RUN yarn --frozen-lockfile && yarn cache clean --force

# =============================
FROM appbase AS development
# =============================

# Set NODE_ENV to development in the development container
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# copy in our source code last, as it changes the most
COPY --chown=default:root . /app

# Bake package.json start command into the image
CMD ["yarn", "start"]

# ===================================
FROM appbase AS staticbuilder
# ===================================

# Set NODE_ENV to production in the staticbuilder container
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
# Print Node.js version
RUN node --version

COPY . /app
RUN yarn build

# =============================
FROM registry.access.redhat.com/ubi9/nginx-120 AS production
# =============================

USER root

# Remove default NGINX files
RUN rm -rf /usr/share/nginx/html/*

RUN chgrp -R 0 /usr/share/nginx/html && \
    chmod -R g=u /usr/share/nginx/html

# Copy static build
COPY --from=staticbuilder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY .prod/nginx.conf /etc/nginx/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
