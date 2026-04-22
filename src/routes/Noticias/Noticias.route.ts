import { Router } from "express"
import type { Request, Response } from "express"
import { CrearNoticiaSchema } from "./Noticias.scheme"
import { prisma } from "@/configuracion/Prisma"
import { Archivos } from "@/middleware/Archivos"
import { requiereAuth } from "@/middleware/Session"

const api: Router = Router()

api.post("/",

    /**
     * Chain of Responsibility
     */
    requiereAuth,
    Archivos({
        formatos: [".jpg", ".jpeg", ".png", ".webp", ".pdf"],
        maxFiles: 5,
        maxSizeFile: 10 * 1024 * 1024,
    }).array("recursos", 5),

    /**
     * Handler
     */
    async (req: Request, res: Response) => {
        const result = CrearNoticiaSchema.safeParse(req.body)

        if (!result.success) {
            res.status(400).json({ mensaje: "DatosInvalidos", noticias: null })
            return
        }

        const archivos = (req.files as Express.Multer.File[]) ?? []

        try {
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
                            }))
                        }
                    }
                },
                include: { recursos: true }
            })

            res.status(201).json({ mensaje: "ok", noticias: [noticia] })
        } catch {
            res.status(500).json({ mensaje: "ErrorServidor", noticias: null })
        }
    })

export { api as NoticiasRoute }