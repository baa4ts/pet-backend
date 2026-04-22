import express, { type Express } from "express"
import morgan from "morgan"
import { env } from "@/configuracion/Env"

/**
 * Instancia principal de Express
 */
const app: Express = express()

// Logs para desarollo
if (env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

// Parseo de body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/**
 * Inicia el servidor en el puerto configurado
 */
app.listen(env.PORT, () => {
    console.log(`Servidor: http://localhost:${env.PORT}`)
})

export { app }