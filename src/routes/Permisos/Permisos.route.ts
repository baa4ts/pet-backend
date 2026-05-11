import { prisma } from "@/configuracion/Prisma"
import { requiereAuth, requierePermiso } from "@/middleware/Session"
import { Router } from "express"
import type { Request, Response } from "express"

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
            SELECT name FROM sqlite_master 
            WHERE type='table' 
            AND name NOT IN ('session', 'account', 'verification', 'recursos')
            AND name NOT LIKE '_prisma%'
            AND name NOT LIKE 'sqlite%'
            ORDER BY name;
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

export { api as PermisoRoute }