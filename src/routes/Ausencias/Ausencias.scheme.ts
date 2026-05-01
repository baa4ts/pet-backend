import { z } from "zod"

export const CrearAusenciaSchema = z.object({
    materia:   z.string().min(1).max(255).trim(),
    fecha:     z.string().datetime(),
    docenteId: z.string().min(1),
})

export const ActualizarAusenciaSchema = z.object({
    materia:   z.string().min(1).max(255).trim().optional(),
    fecha:     z.string().datetime().optional(),
    docenteId: z.string().min(1).optional(),
})

export type CrearAusenciaDTO = z.infer<typeof CrearAusenciaSchema>
export type ActualizarAusenciaDTO = z.infer<typeof ActualizarAusenciaSchema>