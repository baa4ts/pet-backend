import express, { type Express } from "express"
import morgan from "morgan"
import cors from "cors"

import { env } from "@/configuracion/Env"
import { Home } from "@/helpers/Home"

/**
 * Instancia principal del servidor Express
 */
const app: Express = express()

// =====================
// LOGS (solo dev)
// =====================
if (env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

// =====================
// BODY PARSER
// =====================
app.use(express.json({ limit: '600mb' }))
app.use(express.urlencoded({ extended: true, limit: '600mb' }))

// =====================
// CORS
// =====================
app.use(
    cors({
        origin: env.CORS.split(","),
        credentials: true,
    })
)

// =====================
// Servir archivos staticos
// =====================
app.use("/api/static", express.static(Home(env.STATIC, true)));

export { app }