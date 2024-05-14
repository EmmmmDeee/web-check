# Build stage
FROM node:16-buster-slim AS build

WORKDIR /app

COPY package*.json ./

RUN apt-get update && \
    apt-get install -y curl && \
    curl -sSf https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    yarn install --production && \
    rm -rf /app/node_modules/.cache /var/lib/apt/lists/*

COPY . .

RUN yarn build --production

# Final stage
FROM node:16-buster-slim AS final

WORKDIR /app

COPY --from=build /app .

RUN apt-get update && \
    apt-get install -y --no-install-recommends chromium traceroute && \

