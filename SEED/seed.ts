import { id } from "zod/locales";
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

    /**
     * Crear 20 usuarios
     */
    const usuarios = [
        { name: "Martina García", email: "martina.garcia@mail.com" },
        { name: "Lucas Fernández", email: "lucas.fernandez@mail.com" },
        { name: "Valentina López", email: "valentina.lopez@mail.com" },
        { name: "Mateo Rodríguez", email: "mateo.rodriguez@mail.com" },
        { name: "Sofía Martínez", email: "sofia.martinez@mail.com" },
        { name: "Benjamín Pérez", email: "benjamin.perez@mail.com" },
        { name: "Isabella Sánchez", email: "isabella.sanchez@mail.com" },
        { name: "Santiago González", email: "santiago.gonzalez@mail.com" },
        { name: "Camila Torres", email: "camila.torres@mail.com" },
        { name: "Emiliano Díaz", email: "emiliano.diaz@mail.com" },
        { name: "Renata Flores", email: "renata.flores@mail.com" },
        { name: "Tomás Herrera", email: "tomas.herrera@mail.com" },
        { name: "Agustina Morales", email: "agustina.morales@mail.com" },
        { name: "Joaquín Vargas", email: "joaquin.vargas@mail.com" },
        { name: "Luciana Romero", email: "luciana.romero@mail.com" },
        { name: "Facundo Castro", email: "facundo.castro@mail.com" },
        { name: "Antonella Ruiz", email: "antonella.ruiz@mail.com" },
        { name: "Nicolás Gutiérrez", email: "nicolas.gutierrez@mail.com" },
        { name: "Milagros Mendoza", email: "milagros.mendoza@mail.com" },
        { name: "Ignacio Álvarez", email: "ignacio.alvarez@mail.com" },
    ];

    for (const u of usuarios) {
        await auth.api.signUpEmail({
            body: { ...u, password: "abc123456" },
        });
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { permisos: "ausencias,eventos,noticias,usuarios" }
    })

    // Noticias
    await prisma.noticia.createMany({
        data: [
            // Noticias nuevas
            { titulo: "Inicio de clases", descripcion: "El lunes 5 de marzo comienzan las clases.", userId: user.id },
            { titulo: "Reunion de padres", descripcion: "Se convoca a reunion de padres el viernes.", userId: user.id },
            { titulo: "Feria de ciencias", descripcion: "La feria de ciencias sera el 20 de abril.", userId: user.id },
            { titulo: "Suspension de actividades", descripcion: "No habra clases el proximo jueves.", userId: user.id },
            { titulo: "Acto por el Dia de la Independencia", descripcion: "Se realizara un acto escolar el 25 de agosto.", userId: user.id },
            { titulo: "Entrega de libretas", descripcion: "La entrega de libretas sera el viernes 28.", userId: user.id },
            { titulo: "Jornada de limpieza", descripcion: "El sabado se realizara una jornada de limpieza en el patio.", userId: user.id },
            { titulo: "Visita al museo", descripcion: "Los alumnos de 5to visitaran el museo el proximo martes.", userId: user.id },
            { titulo: "Torneo deportivo", descripcion: "Se realizara un torneo de futbol entre clases el sabado.", userId: user.id },
            { titulo: "Taller de lectura", descripcion: "Nuevo taller de lectura los miercoles de 14 a 15hs.", userId: user.id },
            // Noticias viejas
            { titulo: "Torneo deportivo", descripcion: "Se realizara un torneo de futbol entre cursos el sabado.", userId: user.id, createdAt: new Date("2026-03-02T09:00:00Z") },
            { titulo: "Visita al museo", descripcion: "Los alumnos de 5to grado visitaran el museo de historia.", userId: user.id, createdAt: new Date("2026-03-07T08:30:00Z") },
            { titulo: "Taller de lectura", descripcion: "Comienza el taller de lectura los miercoles de 14 a 15hs.", userId: user.id, createdAt: new Date("2026-03-14T13:00:00Z") },
            { titulo: "Vacunacion escolar", descripcion: "El equipo de salud vendra a vacunar a los alumnos de primaria.", userId: user.id, createdAt: new Date("2026-03-21T10:00:00Z") },
            { titulo: "Concurso de dibujo", descripcion: "Se abre la inscripcion al concurso de dibujo institucional.", userId: user.id, createdAt: new Date("2026-03-28T09:00:00Z") },
            { titulo: "Jornada pedagogica", descripcion: "El viernes no habra clases por jornada de capacitacion docente.", userId: user.id, createdAt: new Date("2026-04-01T07:30:00Z") },
            { titulo: "Entrega de libretas", descripcion: "La entrega de libretas del primer trimestre sera el jueves.", userId: user.id, createdAt: new Date("2026-04-07T14:00:00Z") },
            { titulo: "Campeonato de ajedrez", descripcion: "Se invita a participar del campeonato de ajedrez interescolar.", userId: user.id, createdAt: new Date("2026-04-12T10:30:00Z") },
            { titulo: "Semana de la ciencia", descripcion: "Durante toda la semana se realizaran actividades cientificas.", userId: user.id, createdAt: new Date("2026-04-17T09:00:00Z") },
            { titulo: "Acto por efemeride nacional", descripcion: "Se realizara un acto en conmemoracion de la fecha patria.", userId: user.id, createdAt: new Date("2026-04-22T11:00:00Z") },
        ],
    }
    )

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

    const noticias = await prisma.noticia.findMany({
        select: { id: true, userId: true },
        take: 4,
    });

    await Promise.all(
        noticias.map((n, i) =>
            prisma.noticia.update({
                where: { id: n.id },
                data: {
                    recursos: {
                        create: {
                            url: `${i + 1}.jpg`,
                            userId: n.userId,
                        }
                    }
                }
            })
        )
    );

    const users = await prisma.user.findMany({
        where: { id: { not: user.id } },
        select: { id: true },

    });

    const ids = users.map(u => u.id);

    // Ausencias
    await prisma.ausencia.createMany({
        data: [
            // Ausencias futuras
            { materia: "Matematica", fecha: new Date("2026-04-26T00:00:00Z"), docenteId: ids[0], publicadorId: user.id },
            { materia: "Historia", fecha: new Date("2026-04-28T00:00:00Z"), docenteId: ids[1], publicadorId: user.id },
            { materia: "Fisica", fecha: new Date("2026-04-30T00:00:00Z"), docenteId: ids[2], publicadorId: user.id },
            { materia: "Lengua", fecha: new Date("2026-05-02T00:00:00Z"), docenteId: ids[3], publicadorId: user.id },
            { materia: "Quimica", fecha: new Date("2026-05-05T00:00:00Z"), docenteId: ids[4], publicadorId: user.id },
            { materia: "Geografia", fecha: new Date("2026-05-07T00:00:00Z"), docenteId: ids[5], publicadorId: user.id },
            { materia: "Educacion Fisica", fecha: new Date("2026-05-09T00:00:00Z"), docenteId: ids[6], publicadorId: user.id },
            { materia: "Biologia", fecha: new Date("2026-05-12T00:00:00Z"), docenteId: ids[7], publicadorId: user.id },
            { materia: "Informatica", fecha: new Date("2026-05-14T00:00:00Z"), docenteId: ids[8], publicadorId: user.id },
            { materia: "Ingles", fecha: new Date("2026-05-16T00:00:00Z"), docenteId: ids[9], publicadorId: user.id },
            // Ausencias pasadas
            { materia: "Matematica", fecha: new Date("2026-01-08T00:00:00Z"), docenteId: ids[0], publicadorId: user.id },
            { materia: "Historia", fecha: new Date("2026-01-15T00:00:00Z"), docenteId: ids[1], publicadorId: user.id },
            { materia: "Fisica", fecha: new Date("2026-02-03T00:00:00Z"), docenteId: ids[2], publicadorId: user.id },
            { materia: "Lengua", fecha: new Date("2026-02-18T00:00:00Z"), docenteId: ids[3], publicadorId: user.id },
            { materia: "Quimica", fecha: new Date("2026-03-05T00:00:00Z"), docenteId: ids[4], publicadorId: user.id },
            { materia: "Geografia", fecha: new Date("2026-03-12T00:00:00Z"), docenteId: ids[5], publicadorId: user.id },
            { materia: "Educacion Fisica", fecha: new Date("2026-03-20T00:00:00Z"), docenteId: ids[6], publicadorId: user.id },
            { materia: "Biologia", fecha: new Date("2026-04-02T00:00:00Z"), docenteId: ids[7], publicadorId: user.id },
            { materia: "Informatica", fecha: new Date("2026-04-10T00:00:00Z"), docenteId: ids[8], publicadorId: user.id },
            { materia: "Ingles", fecha: new Date("2026-04-18T00:00:00Z"), docenteId: ids[9], publicadorId: user.id },
        ]
    })
    console.log("Seed completado")
}

seed()
    .catch(console.error)
    .finally(() => prisma.$disconnect())