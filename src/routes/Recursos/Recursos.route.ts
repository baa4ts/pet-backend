import { Router } from "express"
import type { Request, Response } from "express"
import { prisma } from "@/configuracion/Prisma"
import { Archivos } from "@/middleware/Archivos"
import { requiereAuth, requierePermiso } from "@/middleware/Session"
import { Home } from "@/helpers/Home"
import { env } from "@/configuracion/Env"
import { io } from "@/index"
import fs from "fs/promises"

const api: Router = Router()

// =====================
// GET - Obtener los ultimos 20 recursos
// =====================
api.get("/", async (req: Request, res: Response) => {
    try {
        const [recursos, count] = await prisma.$transaction([

            /**
             * Consulta para obtener los recursos
             */
            prisma.recurso.findMany({
                where: { noticiaId: null },
                take: 20,
                orderBy: { createdAt: "desc" },
                include: { user: { select: { id: true, name: true } } },
            }),

            /**
             * Consulta para contar los recursos
             */
            prisma.recurso.count({
                where: { noticiaId: null },
            }),
        ])

        res.json({
            message: "ok",
            data: recursos,
            meta: {
                total: count,
                limit: 20,
                offset: null,
            },
        })
        return
    } catch (err) {
        console.error("Error al obtener recursos:", err)
        res.status(500).json({
            message: "ErrorServidor",
            data: [],
            meta: {},
        })
        return
    }
})

// =====================
// POST - Subir un recurso
// =====================
api.post("/",

    /**
     * Chain of Responsibility
     */

    // Sesion y permiso
    requiereAuth,
    requierePermiso(["recursos"]),

    // Archivos
    Archivos({
        formatos: [".jpg", ".jpeg", ".png", ".webp", ".pdf", ".mp4", ".zip"],
        maxFiles: 1,
        maxSizeFile: 10 * 1024 * 1024,
    }).single("archivo"),

    /**
     * Handle
     */
    async (req: Request, res: Response) => {
        if (!req.file) {
            res.status(400).json({
                message: "DatosInvalidos",
                data: [],
                meta: {},
            })
            return
        }

        try {
            /**
             * Consulta para crear el recurso
             */
            const recurso = await prisma.recurso.create({
                data: {
                    url: req.file.filename,
                    tipo: req.file.mimetype,
                    userId: req.user!.id,
                },
                include: { user: { select: { id: true, name: true } } },
            })

            // ===================//
            io.emit("recursos")
            // ===================//

            res.status(201).json({
                message: "ok",
                data: [recurso],
                meta: {},
            })
            return
        } catch (err) {
            console.error("Error al crear recurso:", err)
            res.status(500).json({
                message: "ErrorServidor",
                data: [],
                meta: {},
            })
            return
        }
    }
)

// =====================
// DELETE - Eliminar un recurso
// =====================
api.delete("/:id",

    /**
     * Chain of Responsibility
     */

    // Sesion y permiso
    requiereAuth,
    requierePermiso(["recursos"]),

    /**
     * Handle
     */
    async (req: Request, res: Response) => {
        const idRecurso = Number(req.params.id)

        if (isNaN(idRecurso)) {
            res.status(400).json({
                message: "DatosInvalidos",
                data: [],
                meta: {},
            })
            return
        }

        try {
            /**
             * Consulta para buscar el recurso
             */
            const recurso = await prisma.recurso.findUnique({
                where: { id: idRecurso },
            })

            if (!recurso) {
                res.status(404).json({
                    message: "NoEncontrado",
                    data: [],
                    meta: {},
                })
                return
            }

            /**
             * Eliminar el recurso de la DB
             */
            await prisma.recurso.delete({ where: { id: idRecurso } })

            // Borrar archivo fisico del servidor
            await fs.unlink(Home(env.STATIC, false) + "/" + recurso.url).catch(() => { })

            // ===================//
            io.emit("recursos")
            // ===================//

            res.json({
                message: "ok",
                data: [],
                meta: {},
            })
            return
        } catch (err) {
            console.error("Error al eliminar recurso:", err)
            res.status(500).json({
                message: "ErrorServidor",
                data: [],
                meta: {},
            })
            return
        }
    }
)

export { api as RecursosRoute }