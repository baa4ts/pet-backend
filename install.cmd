@echo off
echo Instalando backend...

:: Instalar dependencias
call pnpm install
call pnpm approve-builds --all

:: Migraciones
call pnpm prisma generate
call pnpm prisma migrate deploy

:: Ejecutar el seed
call pnpm run clear
call pnpm run seed

cls
echo Listo ya puedes correr el server con `pnpm run dev`

popd