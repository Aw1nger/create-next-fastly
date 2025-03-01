FROM node:23.7.0 AS base

FROM base AS deps
RUN apt install libc6 curl bash

WORKDIR /app

COPY package.json bun.lock ./

RUN curl -fsSL https://bun.sh/install | bash && \
    ~/.bun/bin/bun i --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /root/.bun /root/.bun
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN ~/.bun/bin/bun run build

FROM base AS runner
WORKDIR /app

ENV PORT="3000"
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/public ./public

RUN mkdir .next

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY  ./start.js ./

EXPOSE 3000

CMD ["node", "start.js"]
