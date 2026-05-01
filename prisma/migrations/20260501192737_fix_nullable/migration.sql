/*
  Warnings:

  - Made the column `userId` on table `evento` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_evento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaInicio" DATETIME NOT NULL,
    "fechaFin" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "evento_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_evento" ("createdAt", "descripcion", "fechaFin", "fechaInicio", "id", "nombre", "updatedAt", "userId") SELECT "createdAt", "descripcion", "fechaFin", "fechaInicio", "id", "nombre", "updatedAt", "userId" FROM "evento";
DROP TABLE "evento";
ALTER TABLE "new_evento" RENAME TO "evento";
CREATE INDEX "evento_userId_idx" ON "evento"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
