import type { NextFunction, Request, Response } from "express"
import { fromNodeHeaders } from "better-auth/node"
import { auth } from "@/configuracion/Auth"

/**
 * Verifica que el request tenga una sesion activa.
 */
export async function requiereAuth(req: Request, res: Response, next: NextFunction) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    })

    if (!session) {
        res.status(401).json({ message: "NoAutorizado", data: [], meta: {} })
        return;
    }

    req.user = session.user
    req.session = session.session
    next()
}

/**
 * Verificar permisos del usuario
 */
export const requierePermiso = (permisos: Array<string>) => {
    /**
     * 
     */
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ message: "NoAutorizado", data: [], meta: {} })
            return;
        }

        const permisosUsuario = (req.user.permisos ?? "").split(",").filter(Boolean)

        if (!permisos.some(p => permisosUsuario.includes(p))) {
            res.status(403).json({ message: "SinPermisos", data: [], meta: {} })
            return;
        }

        next()
    }
}