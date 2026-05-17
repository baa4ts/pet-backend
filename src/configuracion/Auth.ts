import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/configuracion/Prisma"
import { env } from "./Env"

export const auth = betterAuth({

    /**
     * Base de datos
     */
    database: prismaAdapter(prisma, {
        provider: "sqlite",
    }),

    /**
     * CORS de better
     */
    trustedOrigins: env.CORS.split(","),

    /**
     * Email y password
     */
    emailAndPassword: {
        enabled: true,
    },

    /**
     * Campos adicionales del usuario
     */
    user: {
        additionalFields: {
            permisos: {
                type: "string",
                required: true,
                input: false,
                defaultValue: "",
            },
        },
    },

    /**
     * Seguridad
     */
    rateLimit: {
        enabled: true,
        window: 10,
        max: 100,
    },

    /**
     * Sesion
     */
    session: {
        expiresIn: 60 * 20,
        updateAge: 60 * 15,
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
            strategy: "jwe",
        },
    },

    advanced: {
        // solo para desarrollo
        disableCSRFCheck: env.CSRF_BETTER === "true",
    },
})