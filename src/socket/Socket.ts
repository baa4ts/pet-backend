import { createServer } from "http"
import { Server } from "socket.io"
import { type Express } from "express"
import { env } from "@/configuracion/Env"

export const crearSocket = (app: Express) => {
    const server = createServer(app)
    const io = new Server(server, {
        cors: {
            origin: env.CORS.split(","),
            credentials: true
        }
    })

    io.on("connection", (socket) => {
        console.log(`WS conectado: ${socket.id}`)
        socket.on("disconnect", () => console.log(`WS desconectado: ${socket.id}`))
    })

    return { server, io }
}