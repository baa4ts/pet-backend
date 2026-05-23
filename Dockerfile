# ── Seccio preparacion
FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY . .
COPY SEED ./SEED 

RUN pnpm install --frozen-lockfile
RUN pnpm approve-builds
RUN pnpm prisma generate
RUN pnpm build

# ── Seccion de ejecucion
FROM node:24-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN pnpm install --frozen-lockfile --prod
RUN pnpm approve-builds

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/SEED ./SEED 

EXPOSE 3000

CMD pnpm start