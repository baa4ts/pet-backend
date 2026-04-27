@echo off
echo Instalando backend...

:: Instalar dependencias
call pnpm install
call pnpm approve-builds --all

:: Migraciones
call pnpm prisma generate
call pnpm prisma migrate deploy

mkdir static
copy SEED\1.jpg static\1.jpg
copy SEED\2.jpg static\2.jpg
copy SEED\3.jpg static\3.jpg
copy SEED\4.jpg static\4.jpg
copy SEED\5.jpg static\5.jpg
copy SEED\6.jpg static\6.jpg
copy SEED\7.jpg static\7.jpg
copy SEED\8.jpg static\8.jpg
copy SEED\9.jpg static\9.jpg
copy SEED\10.jpg static\10.jpg

:: Ejecutar el seed
call pnpm run clear
call pnpm run seed

cls
echo Listo ya puedes correr el server con `pnpm run dev`

popd