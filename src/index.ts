import "dotenv/config"

import { app } from "./configuracion/Servidor"
import { auth } from "./configuracion/Auth"
import { toNodeHandler } from "better-auth/node"

import { NoticiasRoute } from "./routes/Noticias/Noticias.route"
import { AusenciasRoute } from "./routes/Ausencias/Ausencias.route"
import { EventosRoute } from "./routes/Eventos/Eventos.route"
import { UsuariosRoute } from "./routes/Usuarios/Usuarios.route"
import { PermisoRoute } from "./routes/Permisos/Permisos.route"
import { crearSocket } from "./socket/Socket"
import { env } from "./configuracion/Env"
import { RecursosRoute } from "./routes/Recursos/Recursos.route"

// =====================
// Better Auth
// =====================
app.all("/api/auth/*splat", toNodeHandler(auth))

// =====================
// ROUTES
// =====================
app.use("/api/noticias", NoticiasRoute)
app.use("/api/ausencias", AusenciasRoute)
app.use("/api/eventos", EventosRoute)
app.use("/api/usuarios", UsuariosRoute)
app.use("/api/permisos", PermisoRoute)
app.use("/api/recursos", RecursosRoute)

// =====================
// WebSocket + Server
// =====================
export const { server, io } = crearSocket(app)

server.listen(env.PORT, () => {
    console.log(`Servidor corriendo en ${env.PORT}`)
})