import "dotenv/config"

import { app } from "./configuracion/Servidor"
import { auth } from "./configuracion/Auth"
import { toNodeHandler } from "better-auth/node"

import { NoticiasRoute } from "./routes/Noticias/Noticias.route"

// =====================
// AUTH
// =====================
app.all("/api/auth/*splat", toNodeHandler(auth))

// =====================
// ROUTES
// =====================
app.use("/api/noticias", NoticiasRoute)