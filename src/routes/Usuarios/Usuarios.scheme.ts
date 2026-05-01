import { z } from "zod"

export const ActualizarPermisosUsuario = z.object({
    permisos: z.string().trim(),
})

export type ActualizarPermisosUsuarioDTO = z.infer<typeof ActualizarPermisosUsuario>