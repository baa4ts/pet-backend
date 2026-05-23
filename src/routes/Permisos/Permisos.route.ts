import { prisma } from "@/configuracion/Prisma"
import { requiereAuth, requierePermiso } from "@/middleware/Session"
import { Router } from "express"
import type { Request, Response } from "express"
import { ActualizarPermisosUsuario } from "./Permisos.scheme"

const api: Router = Router()

api.get("/list",

    /**
    * Chain of Responsibility
    */

    // Session y permiso
    requiereAuth,
    requierePermiso(["permisos"]),

    async (req: Request, res: Response) => {
        try {
            const tablas = (await prisma.$queryRaw<{ name: string }[]>`
                SELECT tablename AS name FROM pg_tables
                WHERE schemaname = 'public'
                AND tablename NOT IN ('session', 'account', 'verification', 'recursos')
                AND tablename NOT LIKE '_prisma%'
                ORDER BY tablename;
            `).map(t => t.name)

            res.json({
                message: "ok",
                data: [...tablas, "permisos"],
                meta: {},
            })
            return;
        } catch (err) {
            console.error("Error al obtener permisos:", err)
            res.status(500).json({
                message: "ErrorServidor",
                data: [],
                meta: {},
            })
            return;
        }
    })

// =====================
// PATCH - Actualizar permisos de un usuario
// =====================
api.patch("/usuario/:id",

    /**
     * Chain of Responsibility
     */

    // Session y permiso
    requiereAuth,
    requierePermiso(["usuarios"]),

    /**
     * Handle
     */
    async (req: Request, res: Response) => {
        const idUsuario = req.params.id

        if (!idUsuario || typeof idUsuario !== "string") {
            res.status(400).json({
                message: "DatosInvalidos",
                data: [],
                meta: {},
            })
            return;
        }

        const result = ActualizarPermisosUsuario.safeParse(req.body)

        if (!result.success) {
            res.status(400).json({
                message: "DatosInvalidos",
                data: [],
                meta: {},
            })
            return;
        }

        try {
            /**
             * Consulta para buscar un unico usuario
             */
            const usuario = await prisma.user.findUnique({
                where: { id: idUsuario },
            })

            if (!usuario) {
                res.status(404).json({
                    message: "NoEncontrado",
                    data: [],
                    meta: {},
                })
                return;
            }

            /**
             * Consulta para actualizar los permisos
             */
            const actualizado = await prisma.user.update({
                where: { id: idUsuario },
                data: { permisos: result.data.permisos.join(",") },
                select: { id: true, name: true, email: true, permisos: true, createdAt: true },
            })

            res.json({
                message: "ok",
                data: [actualizado],
                meta: {},
            })
            return;
        } catch (err) {
            console.error("Error al actualizar permisos:", err)
            res.status(500).json({
                message: "ErrorServidor",
                data: [],
                meta: {},
            })
            return;
        }
    })

export { api as PermisoRoute }