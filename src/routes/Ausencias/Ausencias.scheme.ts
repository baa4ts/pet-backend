import { z } from "zod"

export const CrearAusenciaSchema = z.object({
    materia:   z.string().min(1).max(255),
    fecha:     z.string().datetime(),
    docenteId: z.string().min(1),
})

export type CrearAusenciaDTO = z.infer<typeof CrearAusenciaSchema>