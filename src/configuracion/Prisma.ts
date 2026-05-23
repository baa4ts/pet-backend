import { PrismaClient } from "@/generated/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { env } from "./Env"

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

export { prisma }