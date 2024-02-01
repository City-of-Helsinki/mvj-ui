# ===============================================
FROM node:18-slim AS appbase
# ===============================================

RUN groupadd -g 1001 appuser \
  && useradd --create-home --no-log-init -u 1001 -g 1001 appuser

RUN mkdir /app
RUN chown -R appuser:appuser /app

WORKDIR /app

# Offical image has npm log verbosity as info. More info - https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL warn

# set node environment, either development or production
# use development to install devDependencies
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# Global npm deps in a non-root user directory
ENV NPM_CONFIG_PREFIX=/app/.npm-global
ENV PATH=$PATH:/app/.npm-global/bin

# Yarn
ENV YARN_VERSION 1.22.19
RUN yarn policies set-version $YARN_VERSION

# Use non-root user
USER appuser

# Copy package.json and package-lock.json/yarn.lock files
COPY package.json yarn.lock ./

# Install npm depepndencies
ENV PATH /app/node_modules/.bin:$PATH

USER root
RUN apt-get update
RUN apt-get install -y --no-install-recommends build-essential python3

USER appuser
RUN yarn config set network-timeout 300000
RUN yarn && yarn cache clean --force

USER root
RUN apt-get remove -y build-essential
RUN apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false
RUN rm -rf /var/lib/apt/lists/*
RUN rm -rf /var/cache/apt/archives

# =============================
FROM appbase as development
# =============================

# Set NODE_ENV to development in the development container
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# copy in our source code last, as it changes the most
COPY --chown=appuser:appuser . .

# Bake package.json start command into the image
CMD ["react-scripts", "start"]

# ===================================
FROM appbase as staticbuilder
# ===================================

# Set NODE_ENV to production in the staticbuilder container
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

COPY . /app
RUN yarn compile

# =============================
FROM registry.access.redhat.com/ubi8/nginx-120 as production
# =============================

USER root

RUN chgrp -R 0 /usr/share/nginx/html && \
    chmod -R g=u /usr/share/nginx/html

# Copy static build
COPY --from=staticbuilder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY .prod/nginx.conf  /etc/nginx/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
