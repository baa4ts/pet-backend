import { prisma } from "@/configuracion/Prisma"
import { secureQuery } from "@/helpers/secureQuery"
import { requiereAuth } from "@/middleware/Session"
import type { Request, Response } from "express"
import { Router } from "express"
import { CrearAusenciaSchema } from "./Ausencias.scheme"

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

        return res.json({
            message: "ok",
            data: ausencias,
            meta: {
                total: count,
                limit: limit ?? null,
                offset: offset ?? null,
            },
        })
    } catch (err) {
        console.error("Error al obtener ausencias:", err)
        return res.status(500).json({
            message: "ErrorServidor",
            data: [],
            meta: {},
        })
    }
})

// =====================
// POST - Crear una ausencia
// =====================
api.post("/", requiereAuth, async (req: Request, res: Response) => {
    const result = CrearAusenciaSchema.safeParse(req.body)

    if (!result.success) {
        return res.status(400).json({
            message: "DatosInvalidos",
            data: [],
            meta: {},
        })
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
            return res.status(404).json({
                message: "NoEncontrado",
                data: [],
                meta: {},
            })
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

        return res.status(201).json({
            message: "ok",
            data: [ausencia],
            meta: {},
        })
    } catch (err) {
        console.error("Error al crear ausencia:", err)
        return res.status(500).json({
            message: "ErrorServidor",
            data: [],
            meta: {},
        })
    }
})

// =====================
// GET - Obtener una ausencia mediante ID
// =====================
api.get("/:id", async (req: Request, res: Response) => {
    const idAusencia = Number(req.params.id)

    if (isNaN(idAusencia)) {
        return res.status(400).json({
            message: "DatosInvalidos",
            data: [],
            meta: {},
        })
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
            return res.status(404).json({
                message: "NoEncontrado",
                data: [],
                meta: {},
            })
        }

        return res.json({
            message: "ok",
            data: [ausencia],
            meta: {},
        })
    } catch (err) {
        console.error("Error al obtener ausencia:", err)
        return res.status(500).json({
            message: "ErrorServidor",
            data: [],
            meta: {},
        })
    }
})

// =====================
// DELETE - Eliminar una ausencia
// =====================
api.delete("/:id", requiereAuth, async (req: Request, res: Response) => {
    const idAusencia = Number(req.params.id)

    if (isNaN(idAusencia)) {
        return res.status(400).json({
            message: "DatosInvalidos",
            data: [],
            meta: {},
        })
    }

    try {
        /**
         * Consulta para buscar una unica ausencia
         */
        const ausencia = await prisma.ausencia.findUnique({
            where: { id: idAusencia },
        })

        if (!ausencia) {
            return res.status(404).json({
                message: "NoEncontrado",
                data: [],
                meta: {},
            })
        }

        /**
         * Consulta para borrar la ausencia
         */
        await prisma.ausencia.delete({
            where: { id: idAusencia },
        })

        return res.json({
            message: "ok",
            data: [],
            meta: {},
        })
    } catch (err) {
        console.error("Error al eliminar ausencia:", err)
        return res.status(500).json({
            message: "ErrorServidor",
            data: [],
            meta: {},
        })
    }
})

export { api as AusenciasRoute }