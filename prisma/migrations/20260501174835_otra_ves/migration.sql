/*
  Warnings:

  - You are about to drop the column `impersonatedBy` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `banExpires` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `banReason` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `banned` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.

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
    CONSTRAINT "ausencia_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ausencia_publicadorId_fkey" FOREIGN KEY ("publicadorId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ausencia" ("createdAt", "docenteId", "fecha", "id", "materia", "publicadorId") SELECT "createdAt", "docenteId", "fecha", "id", "materia", "publicadorId" FROM "ausencia";
DROP TABLE "ausencia";
ALTER TABLE "new_ausencia" RENAME TO "ausencia";
CREATE INDEX "ausencia_docenteId_idx" ON "ausencia"("docenteId");
CREATE INDEX "ausencia_publicadorId_idx" ON "ausencia"("publicadorId");
CREATE TABLE "new_evento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaInicio" DATETIME NOT NULL,
    "fechaFin" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "evento_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_evento" ("createdAt", "descripcion", "fechaFin", "fechaInicio", "id", "nombre", "updatedAt", "userId") SELECT "createdAt", "descripcion", "fechaFin", "fechaInicio", "id", "nombre", "updatedAt", "userId" FROM "evento";
DROP TABLE "evento";
ALTER TABLE "new_evento" RENAME TO "evento";
CREATE INDEX "evento_userId_idx" ON "evento"("userId");
CREATE TABLE "new_noticia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "noticia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_noticia" ("createdAt", "descripcion", "id", "titulo", "updatedAt", "userId") SELECT "createdAt", "descripcion", "id", "titulo", "updatedAt", "userId" FROM "noticia";
DROP TABLE "noticia";
ALTER TABLE "new_noticia" RENAME TO "noticia";
CREATE INDEX "noticia_userId_idx" ON "noticia"("userId");
CREATE TABLE "new_recurso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "tipo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "noticiaId" INTEGER,
    "userId" TEXT NOT NULL,
    CONSTRAINT "recurso_noticiaId_fkey" FOREIGN KEY ("noticiaId") REFERENCES "noticia" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recurso_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_recurso" ("createdAt", "id", "noticiaId", "tipo", "url", "userId") SELECT "createdAt", "id", "noticiaId", "tipo", "url", "userId" FROM "recurso";
DROP TABLE "recurso";
ALTER TABLE "new_recurso" RENAME TO "recurso";
CREATE INDEX "recurso_userId_idx" ON "recurso"("userId");
CREATE INDEX "recurso_noticiaId_idx" ON "recurso"("noticiaId");
CREATE TABLE "new_session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_session" ("createdAt", "expiresAt", "id", "ipAddress", "token", "updatedAt", "userAgent", "userId") SELECT "createdAt", "expiresAt", "id", "ipAddress", "token", "updatedAt", "userAgent", "userId" FROM "session";
DROP TABLE "session";
ALTER TABLE "new_session" RENAME TO "session";
CREATE INDEX "session_userId_idx" ON "session"("userId");
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "permisos" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_user" ("createdAt", "email", "emailVerified", "id", "image", "name", "permisos", "updatedAt") SELECT "createdAt", "email", "emailVerified", "id", "image", "name", coalesce("permisos", '') AS "permisos", "updatedAt" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
