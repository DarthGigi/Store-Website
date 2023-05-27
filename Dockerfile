# Dockerfile

FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 4000
CMD ["node", "build"]
