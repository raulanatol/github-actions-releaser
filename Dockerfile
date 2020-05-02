FROM node:14.1.0-buster-slim

RUN apt-get update && apt-get install -y git
    && rm -rf /var/lib/apt/lists/*

RUN npm install github-release-notes -g

ADD entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
