import { z } from "zod"

export const ActualizarPermisosUsuario = z.object({
    permisos: z.array(z.string().trim())
})

export type ActualizarPermisosUsuarioDTO = z.infer<typeof ActualizarPermisosUsuario>