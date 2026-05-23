import { prisma } from "./../src/configuracion/Prisma"
import { auth } from "./../src/configuracion/Auth"
import "dotenv/config"

async function seed() {
    // Crear usuario via Better Auth
    const { user } = await auth.api.signUpEmail({
        body: {
            name: "Admin",
            email: "admin@admin.com",
            password: "abc123456",
        }
    })

    // Crear usuario via Better Auth
    await auth.api.signUpEmail({
        body: {
            name: "yei",
            email: "yeir@yeir.com",
            password: "abc123456",
        }
    })

    // Crear usuario via Better Auth
    await auth.api.signUpEmail({
        body: {
            name: "rula",
            email: "rula@rula.com",
            password: "abc123456",
        }
    })
    await prisma.user.update({
        where: { id: user.id },
        data: { permisos: "ausencias,eventos,noticias,usuarios,recursos,permisos" }
    })

}

seed()
    .catch(console.error)
    .finally(() => prisma.$disconnect())