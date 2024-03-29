FROM node:14-alpine AS dev_image

ARG USER_ID
ARG GROUP_ID

RUN npm install -g @vue/cli @vue/cli-init @vue/cli-service sass

RUN apk update && apk add \
      bash \
      fontconfig \
      git \
      less \
      openssl \
      shadow \
      sudo \
      vim

# Install phantomjs
RUN git clone https://github.com/piksel/phantomjs-raspberrypi.git \
    && cp phantomjs-raspberrypi/bin/phantomjs /usr/local/bin

# Don't attempt to remap the root user (uid=0) or group (gid=0)
# Otherwise reconfigure the node user to map the uid/gid passed in
RUN if [ ${GROUP_ID:-0} -ne 0 ] && [ ${USER_ID:-0} -ne 0 ]; then \
        groupmod --gid ${GROUP_ID} node \
        && usermod --uid ${USER_ID} node \
        ; \
    fi

# Setup the node user with a home directory and sudo permissions
RUN install -d -m 0755 -o node -g node /home/node  \
    && mkdir -p /etc/sudoers.d \
    && echo 'node ALL=(ALL) NOPASSWD: ALL' > /etc/sudoers.d/node-all-nopasswd

COPY ./docker-files/home/.* /docker-files/home/* /home/node/

USER node

WORKDIR /rfid-security-ui

EXPOSE 8080

CMD ["npm", "run", "serve"]

FROM dev_image AS packager

USER root
WORKDIR /package

COPY package*.json ./
RUN npm install
COPY src ./src/
COPY public ./public/
COPY babel.config.js ./
COPY vue.config.js ./
RUN npm run build

FROM nginx as prod_build
RUN mkdir /app
COPY --from=packager /package/dist /app
COPY nginx/rfidsecurityui.template /etc/nginx/templates/default.conf.template
