import { Router } from "express"
import type { Request, Response } from "express"
import { CrearNoticiaSchema } from "./Noticias.scheme"
import { prisma } from "@/configuracion/Prisma"
import { Archivos } from "@/middleware/Archivos"
import { requiereAuth } from "@/middleware/Session"
import { secureQuery } from "@/helpers/secureQuery"

const api: Router = Router()

// =====================
// GET - Obtener todas las noticias
// =====================
api.get("/", async (req: Request, res: Response) => {
    const { limit, offset, order, full } = secureQuery(req)

    const AHORA = new Date()
    const H24 = new Date(AHORA.getTime() - 24 * 60 * 60 * 1000)

    try {
        const [noticias, count] = await prisma.$transaction([

            /**
             * Consulta para obtener las noticias
             */
            prisma.noticia.findMany({
                // El filtro se aplica si no viene full=true
                where: full ? {} : { createdAt: { gte: H24, lte: AHORA } },

                // La paginacion se aplica solo si viene
                ...(limit !== undefined && { take: limit }),
                ...(offset !== undefined && { skip: offset }),

                orderBy: {
                    createdAt: order ?? "desc",
                },

                // Incluir los recursos
                include: { recursos: true }
            }),

            /**
             * Consulta para contar las noticias
             */
            prisma.noticia.count({
                where: full ? {} : { createdAt: { gte: H24, lte: AHORA } },
            }),
        ])

        res.json({
            message: "ok",
            data: noticias,
            meta: {
                total: count,
                limit: limit ?? null,
                offset: offset ?? null,
            },
        })
        return;
    } catch (err) {
        console.error("Error al obtener noticias:", err)
        res.status(500).json({
            message: "ErrorServidor",
            data: [],
            meta: {},
        })
        return;
    }
})

// =====================
// GET - Obtener una noticia mediante ID
// =====================
api.get("/:id", async (req: Request, res: Response) => {
    const idNoticia = Number(req.params.id)

    if (isNaN(idNoticia)) {
        res.status(400).json({
            message: "DatosInvalidos",
            data: [],
            meta: {},
        })
        return;
    }

    try {
        /**
         * Consulta para buscar una noticia
         */
        const noticia = await prisma.noticia.findUnique({
            where: { id: idNoticia },
            include: { recursos: true },
        })

        if (!noticia) {
            res.status(404).json({
                message: "NoEncontrado",
                data: [],
                meta: {},
            })
            return;
        }

        res.json({
            message: "ok",
            data: [noticia],
            meta: {},
        })
        return;
    } catch (err) {
        console.error("Error al obtener noticia:", err)
        res.status(500).json({
            message: "ErrorServidor",
            data: [],
            meta: {},
        })
        return;
    }
})

// =====================
// POST - Crear una noticia
// =====================
api.post("/",
    requiereAuth,
    Archivos({
        formatos: [".jpg", ".jpeg", ".png", ".webp", ".pdf"],
        maxFiles: 5,
        maxSizeFile: 10 * 1024 * 1024,
    }).array("recursos", 5),

    async (req: Request, res: Response) => {
        const result = CrearNoticiaSchema.safeParse(req.body)

        if (!result.success) {
            res.status(400).json({
                message: "DatosInvalidos",
                data: [],
                meta: {},
            })
            return;
        }

        const archivos = (req.files as Express.Multer.File[]) ?? []

        try {
            /**
             * Consulta para crear una noticia
             */
            const noticia = await prisma.noticia.create({
                data: {
                    titulo: result.data.titulo,
                    descripcion: result.data.descripcion,
                    userId: req.user!.id,
                    recursos: {
                        createMany: {
                            data: archivos.map(f => ({
                                url: f.filename,
                                userId: req.user!.id,
                            })),
                        },
                    },
                },
                include: { recursos: true },
            })

            res.status(201).json({
                message: "ok",
                data: [noticia],
                meta: {},
            })
            return;
        } catch (err) {
            console.error("Error al crear noticia:", err);
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
// DELETE - Eliminar una noticia
// =====================
api.delete("/:id", requiereAuth, async (req: Request, res: Response) => {
    const idNoticia = Number(req.params.id)

    if (isNaN(idNoticia)) {
        res.status(400).json({
            message: "DatosInvalidos",
            data: [],
            meta: {},
        })
        return;
    }

    try {
        /**
         * Consulta para buscar una unica noticia
         */
        const noticia = await prisma.noticia.findUnique({
            where: { id: idNoticia }
        })

        if (!noticia) {
            res.status(404).json({
                message: "NoEncontrado",
                data: [],
                meta: {},
            })
            return;
        }

        /**
         * Consulta para borrar una noticia
         */
        await prisma.$transaction([
            prisma.recurso.deleteMany({ where: { noticiaId: idNoticia } }),
            prisma.noticia.delete({ where: { id: idNoticia } }),
        ])

        res.json({
            message: "ok",
            data: [],
            meta: {},
        })
        return;
    } catch (err) {
        console.error("Error al eliminar noticia:", err)
        res.status(500).json({
            message: "ErrorServidor",
            data: [],
            meta: {},
        })
        return;
    }
})

export { api as NoticiasRoute }