-- CreateIndex
CREATE INDEX "ausencias_fecha_idx" ON "ausencias"("fecha");

-- CreateIndex
CREATE INDEX "eventos_fechaInicio_idx" ON "eventos"("fechaInicio");

-- CreateIndex
CREATE INDEX "noticias_createdAt_idx" ON "noticias"("createdAt");
