import { z } from "zod"

export const CrearEventoSchema = z.object({
    nombre:      z.string().min(1).max(255),
    descripcion: z.string().min(1),
    fechaInicio: z.string().datetime(),
    fechaFin:    z.string().datetime().optional(),
})

export const ActualizarEventoSchema = z.object({
    nombre:      z.string().min(1).max(255).optional(),
    descripcion: z.string().min(1).optional(),
    fechaInicio: z.string().datetime().optional(),
    fechaFin:    z.string().datetime().optional(),
})

export type CrearEventoDTO = z.infer<typeof CrearEventoSchema>
export type ActualizarEventoDTO = z.infer<typeof ActualizarEventoSchema>