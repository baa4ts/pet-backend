import { prisma } from "@/configuracion/Prisma"
import { secureQuery } from "@/helpers/secureQuery"
import { requiereAuth, requierePermiso } from "@/middleware/Session"
import type { Request, Response } from "express"
import { Router } from "express"
import { ActualizarAusenciaSchema, CrearAusenciaSchema } from "./Ausencias.scheme"

const api: Router = Router()

// =====================
// GET - Obtener todas las ausencias
// =====================
api.get("/", async (req: Request, res: Response) => {
    const { limit, offset, order, full } = secureQuery(req)

    const AHORA = new Date()
    const HOY = new Date(AHORA.getFullYear(), AHORA.getMonth(), AHORA.getDate())

    try {
        const [ausencias, count] = await prisma.$transaction([

            /**
             * Consulta para obtener las ausencias
             */
            prisma.ausencia.findMany({
                // El filtro se aplica si no viene full=true
                where: full ? {} : { fecha: { gte: HOY } },

                // La paginacion se aplica solo si viene
                ...(limit !== undefined && { take: limit }),
                ...(offset !== undefined && { skip: offset }),

                // Ordenar por los que estan mas cerca
                orderBy: {
                    fecha: order ?? "asc",
                },

                include: {
                    docente: { select: { id: true, name: true, email: true } },
                    publicador: { select: { id: true, name: true, email: true } },
                },
            }),

            /**
             * Consulta para contar las ausencias
             */
            prisma.ausencia.count({
                where: full ? {} : { fecha: { gte: HOY } },
            }),
        ])

        res.json({
            message: "ok",
            data: ausencias,
            meta: {
                total: count,
                limit: limit ?? null,
                offset: offset ?? null,
            },
        })
        return;
    } catch (err) {
        console.error("Error al obtener ausencias:", err)
        res.status(500).json({
            message: "ErrorServidor",
            data: [],
            meta: {},
        })
        return;
    }
})

// =====================
// POST - Crear una ausencia
// =====================
api.post("/",
    /**
     * Chain of Responsibility
     */

    // Session y permiso
    requiereAuth,
    requierePermiso(["ausencias"]),

    /**
     * Handle
     */
    async (req: Request, res: Response) => {
        const result = CrearAusenciaSchema.safeParse(req.body)

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
             * Consulta para verificar que el docente existe
             */
            const docente = await prisma.user.findUnique({
                where: { id: result.data.docenteId },
                select: { id: true, name: true, email: true },
            })

            if (!docente) {
                res.status(404).json({
                    message: "NoEncontrado",
                    data: [],
                    meta: {},
                })
                return;
            }

            /**
             * Consulta para crear una ausencia
             */
            const ausencia = await prisma.ausencia.create({
                data: {
                    materia: result.data.materia,
                    fecha: new Date(result.data.fecha),
                    docenteId: docente.id,
                    publicadorId: req.user!.id,
                },
                include: {
                    docente: { select: { id: true, name: true, email: true } },
                    publicador: { select: { id: true, name: true, email: true } },
                },
            })

            res.status(201).json({
                message: "ok",
                data: [ausencia],
                meta: {},
            })
            return;
        } catch (err) {
            console.error("Error al crear ausencia:", err)
            res.status(500).json({
                message: "ErrorServidor",
                data: [],
                meta: {},
            })
            return;
        }
    })

// =====================
// PUT - Actualizar una ausencia
// =====================
api.put("/:id",
    /**
     * Chain of Responsibility
     */

    // Session y permiso
    requiereAuth,
    requierePermiso(["ausencias"]),

    /**
     * Handle
     */
    async (req: Request, res: Response) => {
        const idAusencia = Number(req.params.id)

        if (isNaN(idAusencia)) {
            res.status(400).json({
                message: "DatosInvalidos",
                data: [],
                meta: {},
            })
            return;
        }

        const result = ActualizarAusenciaSchema.safeParse(req.body)

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
             * Verificar que la ausencia existe
             */
            const ausenciaExistente = await prisma.ausencia.findUnique({
                where: { id: idAusencia },
            })

            if (!ausenciaExistente) {
                res.status(404).json({
                    message: "NoEncontrado",
                    data: [],
                    meta: {},
                })
                return;
            }

            /**
             * Actualizar usando spread + correccion de fecha
             */
            const ausenciaActualizada = await prisma.ausencia.update({
                where: { id: idAusencia },
                data: {
                    ...result.data,
                    fecha: result.data.fecha
                        ? new Date(result.data.fecha)
                        : undefined,
                },
                include: {
                    docente: { select: { id: true, name: true, email: true } },
                    publicador: { select: { id: true, name: true, email: true } },
                },
            })

            res.json({
                message: "ok",
                data: [ausenciaActualizada],
                meta: {},
            })
            return;
        } catch (err) {
            console.error("Error al actualizar ausencia:", err)
            res.status(500).json({
                message: "ErrorServidor",
                data: [],
                meta: {},
            })
            return;
        }
    }
)

// =====================
// GET - Obtener una ausencia mediante ID
// =====================
api.get("/:id", async (req: Request, res: Response) => {
    const idAusencia = Number(req.params.id)

    if (isNaN(idAusencia)) {
        res.status(400).json({
            message: "DatosInvalidos",
            data: [],
            meta: {},
        })
        return;
    }

    try {
        /**
         * Consulta para buscar una unica ausencia
         */
        const ausencia = await prisma.ausencia.findUnique({
            where: { id: idAusencia },
            include: {
                docente: { select: { id: true, name: true, email: true } },
                publicador: { select: { id: true, name: true, email: true } },
            },
        })

        if (!ausencia) {
            res.status(404).json({
                message: "NoEncontrado",
                data: [],
                meta: {},
            })
            return;
        }

        res.json({
            message: "ok",
            data: [ausencia],
            meta: {},
        })
        return;
    } catch (err) {
        console.error("Error al obtener ausencia:", err)
        res.status(500).json({
            message: "ErrorServidor",
            data: [],
            meta: {},
        })
        return;
    }
})

// =====================
// DELETE - Eliminar una ausencia
// =====================
api.delete("/:id",

    /**
     * Chain of Responsibility
     */

    // Session y permiso
    requiereAuth,
    requierePermiso(["ausencias"]),

    /**
     * Handle
     */
    async (req: Request, res: Response) => {
        const idAusencia = Number(req.params.id)

        if (isNaN(idAusencia)) {
            res.status(400).json({
                message: "DatosInvalidos",
                data: [],
                meta: {},
            })
            return;
        }

        try {
            /**
             * Consulta para buscar una unica ausencia
             */
            const ausencia = await prisma.ausencia.findUnique({
                where: { id: idAusencia },
            })

            if (!ausencia) {
                res.status(404).json({
                    message: "NoEncontrado",
                    data: [],
                    meta: {},
                })
                return;
            }

            /**
             * Consulta para borrar la ausencia
             */
            await prisma.ausencia.delete({
                where: { id: idAusencia },
            })

            res.json({
                message: "ok",
                data: [],
                meta: {},
            })
            return;
        } catch (err) {
            console.error("Error al eliminar ausencia:", err)
            res.status(500).json({
                message: "ErrorServidor",
                data: [],
                meta: {},
            })
            return;
        }
    })

export { api as AusenciasRoute }