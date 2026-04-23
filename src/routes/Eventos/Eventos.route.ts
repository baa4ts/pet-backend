import { prisma } from "@/configuracion/Prisma"
import { secureQuery } from "@/helpers/secureQuery"
import { requiereAuth } from "@/middleware/Session"
import { Router } from "express"
import type { Request, Response } from "express"
import { CrearEventoSchema } from "./Eventos.scheme"

const api: Router = Router()

// =====================
// GET - Obtener todos los eventos
// =====================
api.get("/", async (req: Request, res: Response) => {
    const { limit, offset, order, full } = secureQuery(req)

    const AHORA = new Date()

    try {

        const [eventos, count] = await prisma.$transaction([
            /**
             * Obtener todos los eventos que no se han vencido
             */
            prisma.evento.findMany({
                // El filtro se aplica si no viene full=true
                where: full ? {} : { fechaInicio: { gte: AHORA } },

                // La paginacion se aplica solo si viene
                ...(limit !== undefined && { take: limit }),
                ...(offset !== undefined && { skip: offset }),

                // Ordenar por los que estan mas cerca
                orderBy: {
                    fechaInicio: order ?? "asc",
                },
                include: { user: { select: { id: true, name: true, email: true } } },
            }),

            /**
             * Consulta para contar los eventos
             */
            prisma.evento.count({
                where: full ? {} : { fechaInicio: { gte: AHORA } }
            }),
        ])

        return res.json({
            message: "ok",
            data: eventos,
            meta: {
                total: count,
                limit: limit ?? null,
                offset: offset ?? null,
            },
        })
    } catch (err) {
        console.error("Error al obtener eventos:", err)
        return res.status(500).json({
            message: "ErrorServidor",
            data: [],
            meta: {},
        })
    }
})

// =====================
// POST - Crear un evento
// =====================
api.post('/',
    requiereAuth,

    async (req: Request, res: Response) => {
        const result = CrearEventoSchema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({
                message: "DatosInvalidos",
                data: [],
                meta: {},
            })
        }

        try {
            /**
             * Consulta para crear un evento
             */
            const evento = await prisma.evento.create({
                data: {
                    nombre: result.data.nombre,
                    descripcion: result.data.descripcion,
                    fechaInicio: new Date(result.data.fechaInicio),
                    fechaFin: result.data.fechaFin ? new Date(result.data.fechaFin) : null,
                    userId: req.user!.id,
                },
                include: { user: { select: { id: true, name: true, email: true } } },
            })

            return res.status(201).json({
                message: "ok",
                data: [evento],
                meta: {},
            })
        } catch (err) {
            console.error("Error al crear evento:", err)
            return res.status(500).json({
                message: "ErrorServidor",
                data: [],
                meta: {},
            })
        }
    }
)

// =====================
// GET - Obtener un evento mediante ID
// =====================
api.get("/:id", async (req: Request, res: Response) => {
    const idEvento = Number(req.params.id)

    if (isNaN(idEvento)) {
        return res.status(400).json({
            message: "DatosInvalidos",
            data: [],
            meta: {},
        })
    }

    try {

        /**
         * Consulta para buscar un unico evento
         */
        const evento = await prisma.evento.findUnique({
            where: { id: idEvento },
            include: { user: { select: { id: true, name: true, email: true } } },
        })

        if (!evento) {
            return res.status(404).json({
                message: "NoEncontrado",
                data: [],
                meta: {},
            })
        }

        return res.json({
            message: "ok",
            data: [evento],
            meta: {},
        })
    } catch (err) {
        console.error("Error al obtener evento:", err)
        return res.status(500).json({
            message: "ErrorServidor",
            data: [],
            meta: {},
        })
    }
})

// =====================
// DELETE - Eliminar un evento
// =====================
api.delete("/:id", requiereAuth, async (req: Request, res: Response) => {
    const idEvento = Number(req.params.id)

    if (isNaN(idEvento)) {
        return res.status(400).json({
            message: "DatosInvalidos",
            data: [],
            meta: {},
        })
    }

    try {
        /**
         * Consulta para buscar un unico evento
         */
        const evento = await prisma.evento.findUnique({
            where: { id: idEvento }
        })

        if (!evento) {
            return res.status(404).json({
                message: "NoEncontrado",
                data: [],
                meta: {},
            })
        }

        /**
         * Consulta para borrar
         */
        await prisma.evento.delete({
            where: { id: idEvento },
        })

        return res.json({
            message: "ok",
            data: [],
            meta: {},
        })
    } catch (err) {
        console.error("Error al eliminar evento:", err)
        return res.status(500).json({
            message: "ErrorServidor",
            data: [],
            meta: {},
        })
    }
})

export { api as EventosRoute }