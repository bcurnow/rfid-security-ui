from node:14

ARG USER_ID
ARG GROUP_ID

# Don't attempt to remap the root user (uid=0) or group (gid=0)
# Otherwise reconfigure the node user to map the uid/gid passed in
RUN if [ ${GROUP_ID:-0} -ne 0 ] && [ ${USER_ID:-0} -ne 0 ]; then \
        groupmod --gid ${GROUP_ID} node \
        && usermod --uid ${USER_ID} node \
        ;\
    fi

# Setup the node user with a home directory and sudo permissions
RUN install -d -m 0755 -o node -g node /home/node  \
    && mkdir -p /etc/sudoers.d \
    && echo 'node ALL=(ALL) NOPASSWD: ALL' > /etc/sudoers.d/node-all-nopasswd

COPY ./docker-files/home/.* /docker-files/home/* /home/node/

RUN apt-get update && apt-get -y install --no-install-recommends \
      fontconfig \
      less \
      libssl1.0.2 \
      sudo \
      vim \
 && rm -rf /var/lib/apt/lists/*

# Install phantomjs
RUN git clone https://github.com/piksel/phantomjs-raspberrypi.git \
 && cp phantomjs-raspberrypi/bin/phantomjs /usr/local/bin

RUN npm install -g @vue/cli @vue/cli-init @vue/cli-service sass

USER node

WORKDIR /rfid-security-ui

EXPOSE 8080

CMD ['npm', 'run', 'serve']
