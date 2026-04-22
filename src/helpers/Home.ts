import fs from "node:fs";
import path from "node:path";

/**
 * Resuelve una ruta relativa al proyecto.
 * @param relative - Ruta a concatenar
 * @param create - Si es true, crea el directorio si no existe
 */
export function Home(relative: string, create = false): string {
    const full = path.join(process.cwd(), relative);
    if (create && !fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
    return full;
}