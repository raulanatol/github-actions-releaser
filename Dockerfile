FROM node:14.1.0-buster-slim

RUN npm install github-release-notes -g

ENTRYPOINT ["/entrypoint.sh"]
