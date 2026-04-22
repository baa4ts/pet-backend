import express, { type Express } from "express"
import morgan from "morgan"
import cors from "cors"

import { env } from "@/configuracion/Env"

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
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// =====================
// CORS
// =====================
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
)

// =====================
// START SERVER
// =====================
app.listen(env.PORT, () => {
    console.log(`Servidor: http://localhost:${env.PORT}`)
})

export { app }