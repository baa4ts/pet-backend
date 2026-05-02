import { z } from "zod"

export const CrearNoticiaSchema = z.object({
    titulo:      z.string().min(1).max(255).trim(),
    descripcion: z.string().min(1).trim(),
})

export const ActualizarNoticiaSchema = z.object({
    titulo:      z.string().min(1).max(255).trim().optional(),
    descripcion: z.string().min(1).trim().optional(),
})

export type CrearNoticiaDTO    = z.infer<typeof CrearNoticiaSchema>
export type ActualizarNoticiaDTO = z.infer<typeof ActualizarNoticiaSchema>