import { auth } from "./../src/configuracion/Auth"
import { prisma } from "./../src/configuracion/Prisma"
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

    await prisma.user.update({
        where: { id: user.id },
        data: { permisos: "ausencia,eventos,noticias,usuarios" }
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

    // Eventos
    await prisma.evento.createMany({
        data: [
            // Eventos futuros
            { nombre: "Acto de fin de mes", descripcion: "Acto escolar en conmemoracion del mes.", fechaInicio: new Date("2026-04-30T10:00:00Z"), userId: user.id },
            { nombre: "Feria de ciencias", descripcion: "Exposicion de proyectos de los alumnos.", fechaInicio: new Date("2026-05-10T09:00:00Z"), fechaFin: new Date("2026-05-10T17:00:00Z"), userId: user.id },
            { nombre: "Reunion de padres", descripcion: "Reunion informativa sobre el progreso del trimestre.", fechaInicio: new Date("2026-05-20T18:00:00Z"), userId: user.id },
            { nombre: "Torneo intercolegial", descripcion: "Torneo de futbol entre colegios de la zona.", fechaInicio: new Date("2026-06-05T08:00:00Z"), fechaFin: new Date("2026-06-05T16:00:00Z"), userId: user.id },
            // Eventos pasados
            { nombre: "Inicio del ciclo lectivo", descripcion: "Primer dia de clases del año.", fechaInicio: new Date("2026-03-02T07:30:00Z"), userId: user.id },
            { nombre: "Acto 24 de marzo", descripcion: "Acto en conmemoracion del Dia de la Memoria.", fechaInicio: new Date("2026-03-24T10:00:00Z"), userId: user.id },
        ]
    })

    // Ausencias
    await prisma.ausencia.createMany({
        data: [
            // Ausencias futuras
            { materia: "Matematica", fecha: new Date("2026-04-24T00:00:00Z"), docenteId: user.id, publicadorId: user.id },
            { materia: "Historia", fecha: new Date("2026-04-25T00:00:00Z"), docenteId: user.id, publicadorId: user.id },
            { materia: "Fisica", fecha: new Date("2026-05-02T00:00:00Z"), docenteId: user.id, publicadorId: user.id },
            // Ausencias pasadas
            { materia: "Lengua", fecha: new Date("2026-04-10T00:00:00Z"), docenteId: user.id, publicadorId: user.id },
            { materia: "Quimica", fecha: new Date("2026-04-15T00:00:00Z"), docenteId: user.id, publicadorId: user.id },
        ]
    })

    console.log("Seed completado")
}

seed()
    .catch(console.error)
    .finally(() => prisma.$disconnect())