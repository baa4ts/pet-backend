import { z } from "zod"

export const CrearNoticiaSchema = z.object({
    titulo:      z.string().min(1).max(255).trim(),
    descripcion: z.string().min(1).trim(),
})

export type CrearNoticiaDTO = z.infer<typeof CrearNoticiaSchema>