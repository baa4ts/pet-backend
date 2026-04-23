import { prisma } from "@/configuracion/Prisma"
import { secureQuery } from "@/helpers/secureQuery"
import { requiereAuth, requierePermiso } from "@/middleware/Session"
import type { Request, Response } from "express"
import { Router } from "express"
import { ActualizarPermisosUsuario } from "./Usuarios.scheme"
import { auth } from "@/configuracion/Auth"

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

// =====================
// GET - Obtener un usuario mediante el id
// =====================
api.get("/:id",

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

        try {
            /**
             * Consulta para buscar un unico usuario
             */
            const usuario = await prisma.user.findUnique({
                where: { id: idUsuario },
                select: { id: true, name: true, email: true, role: true, permisos: true, createdAt: true },
            })

            if (!usuario) {
                res.status(404).json({
                    message: "NoEncontrado",
                    data: [],
                    meta: {},
                })
                return;
            }

            res.json({
                message: "ok",
                data: [usuario],
                meta: {},
            })
            return;
        } catch (err) {
            console.error("Error al obtener usuario:", err)
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
api.patch("/:id",

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
                data: { permisos: result.data.permisos },
                select: { id: true, name: true, email: true, role: true, permisos: true, createdAt: true },
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

// =====================
// POST - Banear un usuario
// =====================
api.post("/:id/ban",

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
             * Banear usuario via Better Auth
             */
            await auth.api.banUser({
                body: { userId: idUsuario },
            })

            res.json({
                message: "ok",
                data: [],
                meta: {},
            })
            return;
        } catch (err) {
            console.error("Error al banear usuario:", err)
            res.status(500).json({
                message: "ErrorServidor",
                data: [],
                meta: {},
            })
            return;
        }
    })

// =====================
// DELETE - Eliminar un usuario
// =====================
api.delete("/:id",

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
             * Eliminar usuario via Better Auth
             */
            await auth.api.removeUser({
                body: { userId: idUsuario },
            })

            res.json({
                message: "ok",
                data: [],
                meta: {},
            })
            return;
        } catch (err) {
            console.error("Error al eliminar usuario:", err)
            res.status(500).json({
                message: "ErrorServidor",
                data: [],
                meta: {},
            })
            return;
        }
    })

export { api as UsuariosRoute }