import multer from "multer"
import path from "path"
import type { Request } from "express"
import { Home } from "@/helpers/Home"

export interface InterfaceArchivos {
    formatos:    string[]
    maxFiles:    number
    maxSizeFile: number
}

export const Archivos = ({ formatos, maxFiles, maxSizeFile }: InterfaceArchivos) => multer({
    storage: multer.diskStorage({
        // Destino donde se guardan los archivos
        destination: (_req: Request, _file, cb) => {
            cb(null, Home(process.env.STATIC!, true))
        },
        // Renombrar los archivos con formato: dia-mes-anio_hora-min-seg-mili-(4-random char).ext
        filename: (_req: Request, file, cb) => {
            const t    = new Date()
            const rand = Math.random().toString(36).slice(2, 6)
            const ts   = `${t.getDate()}-${t.getMonth() + 1}-${t.getFullYear()}_${t.getHours()}-${t.getMinutes()}-${t.getSeconds()}-${t.getMilliseconds()}-${rand}`
            cb(null, ts + path.extname(file.originalname))
        }
    }),
    // Limites tamanio, y cantidad maxima
    limits: { fileSize: maxSizeFile, files: maxFiles },
    // Filtro de formatos permitidos
    fileFilter: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()
        cb(null, formatos.includes(ext))
    }
})