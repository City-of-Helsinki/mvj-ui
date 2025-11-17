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

# Install exact versions of dependencies and clean cache.
# Use non-prod flag to install devDependencies
RUN yarn --frozen-lockfile --production=false && yarn cache clean --force

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

# Copy static build
COPY --from=staticbuilder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY .prod/nginx.conf /etc/nginx/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
