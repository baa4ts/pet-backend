import { prisma } from "./../src/configuracion/Prisma"
import { auth } from "./../src/configuracion/Auth"
import "dotenv/config"

async function clear() {
    await prisma.recurso.deleteMany()
    await prisma.noticia.deleteMany()
    await prisma.ausencia.deleteMany()
    await prisma.evento.deleteMany()

    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.verification.deleteMany()

    await prisma.user.deleteMany()

    console.log("Base de datos limpiada")
}

clear()
    .catch(console.error)
    .finally(() => prisma.$disconnect())