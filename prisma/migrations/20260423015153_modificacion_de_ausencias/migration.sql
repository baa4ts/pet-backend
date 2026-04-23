/*
  Warnings:

  - Added the required column `fecha` to the `ausencia` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ausencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "materia" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "docenteId" TEXT NOT NULL,
    "publicadorId" TEXT NOT NULL,
    CONSTRAINT "ausencia_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ausencia_publicadorId_fkey" FOREIGN KEY ("publicadorId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ausencia" ("createdAt", "docenteId", "id", "materia", "publicadorId") SELECT "createdAt", "docenteId", "id", "materia", "publicadorId" FROM "ausencia";
DROP TABLE "ausencia";
ALTER TABLE "new_ausencia" RENAME TO "ausencia";
CREATE INDEX "ausencia_docenteId_idx" ON "ausencia"("docenteId");
CREATE INDEX "ausencia_publicadorId_idx" ON "ausencia"("publicadorId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
