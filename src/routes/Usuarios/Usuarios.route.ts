import { prisma } from "@/configuracion/Prisma"
import { secureQuery } from "@/helpers/secureQuery"
import { requiereAuth, requierePermiso } from "@/middleware/Session"
import type { Request, Response } from "express"
import { Router } from "express"

const api: Router = Router()

// =====================
// GET - Obtener todos los usuarios
// =====================
api.get("/",

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
        const { limit, offset, order } = secureQuery(req)

        try {
            const [usuarios, count] = await prisma.$transaction([

                /**
                 * Consulta para obtener los usuarios
                 */
                prisma.user.findMany({
                    // La paginacion se aplica solo si viene
                    ...(limit !== undefined && { take: limit }),
                    ...(offset !== undefined && { skip: offset }),

                    // Ordenar por fecha de creacion
                    orderBy: {
                        createdAt: order ?? "desc",
                    },

                    select: { id: true, name: true, email: true, role: true, permisos: true, createdAt: true },
                }),

                /**
                 * Consulta para contar los usuarios
                 */
                prisma.user.count(),
            ])

            res.json({
                message: "ok",
                data: usuarios,
                meta: {
                    total: count,
                    limit: limit ?? null,
                    offset: offset ?? null,
                },
            })
            return;
        } catch (err) {
            console.error("Error al obtener usuarios:", err)
            res.status(500).json({
                message: "ErrorServidor",
                data: [],
                meta: {},
            })
            return;
        }
    })

export { api as UsuariosRoute }