import { z } from "zod"

export const CrearEventoSchema = z.object({
    nombre: z.string().min(1).max(255),
    descripcion: z.string().min(1),
    fechaInicio: z.string().datetime(),
    fechaFin: z.string().datetime().optional(),
})

export type CrearEventoDTO = z.infer<typeof CrearEventoSchema>