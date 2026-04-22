import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "@prisma/client"
import { env } from "./Env"

/**
 * ORM Prisma
 */
const adapter = new PrismaBetterSqlite3({ url: env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export { prisma }