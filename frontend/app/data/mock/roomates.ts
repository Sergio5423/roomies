import type { Roommate } from "../../../domain/roomies/Roommate";

export const roommates: Roommate[] = [
  {
    id: 1,
    nombre: "Carlos Martínez",
    edad: 23,
    ciudad: "Valledupar",
    descripcion:
      "Estudiante universitario, tranquilo, responsable y organizado.",
    imagen:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    intereses: ["Fútbol", "Videojuegos", "Música"],
    presupuestoMaximo: 800000,
    disponible: true,
    buscandoHabitacion: true,
    habitacionId: 1,
    habitacionesInteresadasIds: [4, 1],
  },

  {
    id: 2,
    nombre: "Laura Gómez",
    edad: 22,
    ciudad: "Medellín",
    descripcion:
      "Estudiante y trabajadora. Busca un ambiente tranquilo y organizado.",
    imagen:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    intereses: ["Lectura", "Viajes", "Cocina"],
    presupuestoMaximo: 900000,
    disponible: true,
    buscandoHabitacion: true,
    habitacionId: 2,
    habitacionesInteresadasIds: [7, 12, 9],
  },

  {
    id: 3,
    nombre: "Andrés Rodríguez",
    edad: 25,
    ciudad: "Bogotá",
    descripcion:
      "Profesional joven, responsable y respetuoso con los espacios compartidos.",
    imagen:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    intereses: ["Gimnasio", "Tecnología", "Películas"],
    presupuestoMaximo: 1200000,
    disponible: true,
    buscandoHabitacion: true,
    habitacionId: 3,
    habitacionesInteresadasIds: [10, 13,],
  },

  {
    id: 4,
    nombre: "Mariana López",
    edad: 24,
    ciudad: "Cartagena",
    descripcion:
      "Persona sociable y organizada que busca compartir alojamiento.",
    imagen:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    intereses: ["Playa", "Música", "Viajes"],
    presupuestoMaximo: 750000,
    disponible: true,
    buscandoHabitacion: true,
    habitacionId: 14,
    habitacionesInteresadasIds: [9, 16, 10, 7],
  },

  {
    id: 5,
    nombre: "Daniel Torres",
    edad: 21,
    ciudad: "Valledupar",
    descripcion:
      "Estudiante de ingeniería. Prefiere un ambiente tranquilo para estudiar.",
    imagen:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    intereses: ["Programación", "Fútbol", "Videojuegos"],
    presupuestoMaximo: 700000,
    disponible: true,
    buscandoHabitacion: true,
    habitacionId: 1,
    habitacionesInteresadasIds: [4, 1],
  },

  {
    id: 6,
    nombre: "Sofía Hernández",
    edad: 23,
    ciudad: "Barranquilla",
    descripcion:
      "Estudiante universitaria, ordenada y amigable. Busca convivencia respetuosa.",
    imagen:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
    intereses: ["Danza", "Cocina", "Series"],
    presupuestoMaximo: 850000,
    disponible: true,
    buscandoHabitacion: true,
    habitacionId: 6,
    habitacionesInteresadasIds: [7],
  },

  {
    id: 7,
    nombre: "Miguel Sánchez",
    edad: 26,
    ciudad: "Medellín",
    descripcion:
      "Profesional del área tecnológica, independiente y organizado.",
    imagen:
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea",
    intereses: ["Tecnología", "Gimnasio", "Viajes"],
    presupuestoMaximo: 1100000,
    disponible: true,
    buscandoHabitacion: true,
    habitacionId: 3,
    habitacionesInteresadasIds: [7, 12, 9],
  },

  {
    id: 8,
    nombre: "Valentina Pérez",
    edad: 22,
    ciudad: "Bogotá",
    descripcion:
      "Estudiante de diseño. Le gusta mantener los espacios limpios y tranquilos.",
    imagen:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    intereses: ["Diseño", "Arte", "Fotografía"],
    presupuestoMaximo: 1000000,
    disponible: true,
    buscandoHabitacion: true,
    habitacionId: 2,
    habitacionesInteresadasIds: [],
  },

  {
    id: 9,
    nombre: "Juan David Castro",
    edad: 24,
    ciudad: "Cali",
    descripcion:
      "Profesional joven, sociable y responsable. Busca una buena convivencia.",
    imagen:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598",
    intereses: ["Fútbol", "Música", "Gastronomía"],
    presupuestoMaximo: 900000,
    disponible: true,
    buscandoHabitacion: true,
    habitacionId: 7,
    habitacionesInteresadasIds: [],
  },

  {
    id: 10,
    nombre: "Camila Moreno",
    edad: 25,
    ciudad: "Santa Marta",
    descripcion:
      "Trabajadora independiente que busca compartir un espacio agradable.",
    imagen:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
    intereses: ["Playa", "Yoga", "Viajes"],
    presupuestoMaximo: 800000,
    disponible: true,
    buscandoHabitacion: true,
    habitacionId: 6,
    habitacionesInteresadasIds: [],
  },

  {
    id: 11,
    nombre: "Sebastián Vargas",
    edad: 23,
    ciudad: "Bucaramanga",
    descripcion:
      "Estudiante universitario, tranquilo y comprometido con sus responsabilidades.",
    imagen:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3",
    intereses: ["Videojuegos", "Tecnología", "Fútbol"],
    presupuestoMaximo: 750000,
    disponible: true,
    buscandoHabitacion: true,
    habitacionId: 5,
    habitacionesInteresadasIds: [],
  },

  {
    id: 12,
    nombre: "Natalia Rojas",
    edad: 24,
    ciudad: "Valledupar",
    descripcion:
      "Profesional joven, organizada y tranquila. Busca un ambiente agradable.",
    imagen:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
    intereses: ["Lectura", "Cocina", "Música"],
    presupuestoMaximo: 950000,
    disponible: true,
    buscandoHabitacion: true,
    habitacionId: 8,
    habitacionesInteresadasIds: [],
  },

  {
    id: 13,
    nombre: "Felipe Ramírez",
    edad: 27,
    ciudad: "Medellín",
    descripcion:
      "Profesional independiente que valora la privacidad y el respeto.",
    imagen:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
    intereses: ["Gimnasio", "Tecnología", "Cine"],
    presupuestoMaximo: 1300000,
    disponible: true,
    buscandoHabitacion: true,
    habitacionId: 3,
    habitacionesInteresadasIds: [],
  },

  {
    id: 14,
    nombre: "Isabella Torres",
    edad: 21,
    ciudad: "Cartagena",
    descripcion:
      "Estudiante universitaria, alegre y organizada. Busca compartir con otras personas.",
    imagen:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
    intereses: ["Playa", "Viajes", "Fotografía"],
    presupuestoMaximo: 700000,
    disponible: true,
    buscandoHabitacion: true,
    habitacionId: 5,
    habitacionesInteresadasIds: [],
  },

  {
    id: 15,
    nombre: "Mateo Jiménez",
    edad: 26,
    ciudad: "Cali",
    descripcion:
      "Profesional joven, tranquilo y responsable con los espacios comunes.",
    imagen:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    intereses: ["Gimnasio", "Fútbol", "Cocina"],
    presupuestoMaximo: 1000000,
    disponible: true,
    buscandoHabitacion: true,
    habitacionId: 7,
    habitacionesInteresadasIds: [],
  },

  {
    id: 16,
    nombre: "Paula Martínez",
    edad: 23,
    ciudad: "Barranquilla",
    descripcion:
      "Estudiante y trabajadora. Busca una convivencia tranquila y respetuosa.",
    imagen:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    intereses: ["Música", "Lectura", "Viajes"],
    presupuestoMaximo: 850000,
    disponible: true,
    buscandoHabitacion: true,
    habitacionId: 11,
    habitacionesInteresadasIds: [5, 12, 10, 14],
  },
];