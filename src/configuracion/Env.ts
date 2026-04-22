import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

/**
 * Configuracion y tipado estricto de las variables de entorno
 */
export const env = createEnv({
    server: {
        PORT: z.string().default("3000"),
        NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
        DATABASE_URL: z.string().default("file:./dev.db"),
        BETTER_AUTH_SECRET: z.string().min(1),
        BETTER_AUTH_URL: z.string().default("http://localhost:3000"),
    },
    runtimeEnv: process.env,
})