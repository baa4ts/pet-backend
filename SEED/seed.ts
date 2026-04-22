import { auth } from "./../src/configuracion/Auth"
import { prisma } from "./../src/configuracion/Prisma"
import "dotenv/config"

async function seed() {
    // Crear usuario via Better Auth
    const { user } = await auth.api.signUpEmail({
        body: {
            name: "Admin",
            email: "admin@school.com",
            password: "admin1234",
        }
    })

    // Noticias
    await prisma.noticia.createMany({
        data: [
            // Noticias nuevas
            { titulo: "Inicio de clases", descripcion: "El lunes 5 de marzo comienzan las clases.", userId: user.id },
            { titulo: "Reunion de padres", descripcion: "Se convoca a reunion de padres el viernes.", userId: user.id },
            { titulo: "Feria de ciencias", descripcion: "La feria de ciencias sera el 20 de abril.", userId: user.id },
            { titulo: "Suspension de actividades", descripcion: "No habra clases el proximo jueves.", userId: user.id },
            // Noticias viejas
            { titulo: "Inicio de clases", descripcion: "El lunes comienzan las clases del nuevo ciclo lectivo.", userId: user.id, createdAt: new Date("2026-01-05T08:30:00Z") },
            { titulo: "Reunion de padres", descripcion: "Se convoca a reunion de padres el proximo viernes.", userId: user.id, createdAt: new Date("2026-01-12T14:00:00Z") },
            { titulo: "Entrega de materiales", descripcion: "Se entregaran los materiales escolares esta semana.", userId: user.id, createdAt: new Date("2026-01-20T09:15:00Z") },
            { titulo: "Feria de ciencias", descripcion: "La feria de ciencias se realizara a fin de mes.", userId: user.id, createdAt: new Date("2026-02-03T10:00:00Z") },
            { titulo: "Suspension de actividades", descripcion: "No habra clases el jueves por paro docente.", userId: user.id, createdAt: new Date("2026-02-14T07:45:00Z") },
            { titulo: "Acto por efemeride", descripcion: "Se realizara un acto en conmemoracion de la fecha.", userId: user.id, createdAt: new Date("2026-02-24T11:30:00Z") }
        ]
    })

    console.log("Seed completado")
}

seed()
    .catch(console.error)
    .finally(() => prisma.$disconnect())