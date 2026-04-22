import type { Request } from "express"

/**
 * Obtiene un query param de forma segura con valor por defecto.
 */
export function secureQuery<T>(req: Request, key: string, defaultValue?: T): T | undefined {
    const raw = req.query[key]

    if (typeof raw === "string" && raw.trim() !== "") {
        return raw as unknown as T
    }

    return defaultValue
}