import { Router } from "express";
import type { Request, Response } from "express";
import { prisma } from "@/configuracion/Prisma";
import { requiereAuth, requierePermiso } from "@/middleware/Session";

const api: Router = Router();

// =====================
// GET - Queries mas lentas
// =====================
api.get("/mas-lentas",
    requiereAuth,
    requierePermiso(["analitica"]),
    async (req: Request, res: Response) => {
        try {
            const data = await prisma.$queryRaw<{ query: string; calls: bigint; mean_exec_time: number; total_exec_time: number }[]>`
                SELECT query, calls, mean_exec_time, total_exec_time
                FROM pg_stat_statements
                ORDER BY mean_exec_time DESC
                LIMIT 10
            `;
            res.json({ message: "ok", data: data.map(r => ({ ...r, calls: Number(r.calls) })), meta: {} });
            return;
        } catch (err) {
            console.error("Error al obtener queries mas lentas:", err);
            res.status(500).json({ message: "ErrorServidor", data: [], meta: {} });
            return;
        }
    }
);

// =====================
// GET - Queries mas ejecutadas
// =====================
api.get("/mas-ejecutadas",
    requiereAuth,
    requierePermiso(["analitica"]),
    async (req: Request, res: Response) => {
        try {
            const data = await prisma.$queryRaw<{ query: string; calls: bigint }[]>`
                SELECT query, calls
                FROM pg_stat_statements
                ORDER BY calls DESC
                LIMIT 10
            `;
            res.json({ message: "ok", data: data.map(r => ({ ...r, calls: Number(r.calls) })), meta: {} });
            return;
        } catch (err) {
            console.error("Error al obtener queries mas ejecutadas:", err);
            res.status(500).json({ message: "ErrorServidor", data: [], meta: {} });
            return;
        }
    }
);

// =====================
// GET - Queries que mas tiempo total consumen
// =====================
api.get("/mas-tiempo",
    requiereAuth,
    requierePermiso(["analitica"]),
    async (req: Request, res: Response) => {
        try {
            const data = await prisma.$queryRaw<{ query: string; total_exec_time: number; calls: bigint }[]>`
                SELECT query, total_exec_time, calls
                FROM pg_stat_statements
                ORDER BY total_exec_time DESC
                LIMIT 10
            `;
            res.json({ message: "ok", data: data.map(r => ({ ...r, calls: Number(r.calls) })), meta: {} });
            return;
        } catch (err) {
            console.error("Error al obtener queries por tiempo total:", err);
            res.status(500).json({ message: "ErrorServidor", data: [], meta: {} });
            return;
        }
    }
);

// =====================
// GET - Queries con mas rows procesadas
// =====================
api.get("/mas-rows",
    requiereAuth,
    requierePermiso(["analitica"]),
    async (req: Request, res: Response) => {
        try {
            const data = await prisma.$queryRaw<{ query: string; rows: bigint; calls: bigint }[]>`
                SELECT query, rows, calls
                FROM pg_stat_statements
                ORDER BY rows DESC
                LIMIT 10
            `;
            res.json({ message: "ok", data: data.map(r => ({ ...r, rows: Number(r.rows), calls: Number(r.calls) })), meta: {} });
            return;
        } catch (err) {
            console.error("Error al obtener queries por rows:", err);
            res.status(500).json({ message: "ErrorServidor", data: [], meta: {} });
            return;
        }
    }
);

export { api as AnaliticaRoute };