-- CreateTable
CREATE TABLE "recurso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "tipo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "noticiaId" INTEGER,
    "userId" TEXT NOT NULL,
    CONSTRAINT "recurso_noticiaId_fkey" FOREIGN KEY ("noticiaId") REFERENCES "noticia" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "recurso_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "noticia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "noticia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ausencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "materia" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "docenteId" TEXT NOT NULL,
    "publicadorId" TEXT NOT NULL,
    CONSTRAINT "ausencia_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ausencia_publicadorId_fkey" FOREIGN KEY ("publicadorId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "evento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaInicio" DATETIME NOT NULL,
    "fechaFin" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "evento_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "recurso_userId_idx" ON "recurso"("userId");

-- CreateIndex
CREATE INDEX "recurso_noticiaId_idx" ON "recurso"("noticiaId");

-- CreateIndex
CREATE INDEX "noticia_userId_idx" ON "noticia"("userId");

-- CreateIndex
CREATE INDEX "ausencia_docenteId_idx" ON "ausencia"("docenteId");

-- CreateIndex
CREATE INDEX "ausencia_publicadorId_idx" ON "ausencia"("publicadorId");

-- CreateIndex
CREATE INDEX "evento_userId_idx" ON "evento"("userId");
