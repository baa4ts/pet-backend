import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { admin } from "better-auth/plugins"
import { prisma } from "@/configuracion/Prisma"

export const auth = betterAuth({

    /**
     * Base de datos
     */
    database: prismaAdapter(prisma, {
        provider: "sqlite"
    }),

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
                required: false,
                input: false,
                defaultValue: "",
            },
        },
    },

    /**
     * Plugins
     */
    plugins: [
        admin(),
    ],

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
        disableCSRFCheck: true,
    },
})