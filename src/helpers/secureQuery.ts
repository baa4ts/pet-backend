import type { Request } from "express"

/**
 * Helpers seguros para query params
 */

export function secureNumber(req: Request, key: string, defaultValue = 0): number {
    const raw = req.query[key]
    const value = Number(raw)

    if (isNaN(value)) return defaultValue

    return value
}

export function secureString(req: Request, key: string, defaultValue = ""): string {
    const raw = req.query[key]

    if (typeof raw !== "string") return defaultValue

    const value = raw.trim()

    if (value === "") return defaultValue

    return value
}

export function secureStringOptional(req: Request, key: string): string | undefined {
    const raw = req.query[key]

    if (typeof raw !== "string") return undefined

    const value = raw.trim()

    if (value === "") return undefined

    return value
}

export function secureBoolean(req: Request, key: string, defaultValue = false): boolean {
    const raw = req.query[key]

    if (typeof raw !== "string") return defaultValue

    return raw === "true"
}

export function secureQuery(req: Request) {
    const limitRaw = req.query.limit
    const offsetRaw = req.query.offset
    const fullRaw = req.query.full
    const orderRaw = req.query.order

    const limit =
        limitRaw !== undefined ? Number(limitRaw) : undefined

    const offset =
        offsetRaw !== undefined ? Number(offsetRaw) : undefined

    const order =
        orderRaw === "asc" || orderRaw === "desc"
            ? orderRaw
            : undefined

    const full =
        fullRaw === "true"
            ? true
            : fullRaw === "false"
                ? false
                : undefined

    return {
        limit,
        offset,
        full,
        order,
    } as const
}