// main.ts
import { Alojamiento } from './src/model/Alojamiento';
import { Inquilino } from './src/model/Inquilino';
import { Solicitud } from './src/model/Solicitud';
import { Reserva } from './src/model/Reserva';

console.log('=== SISTEMA DE GESTIÓN DE ALOJAMIENTOS EN MEMORIA ===\n');

// 1. Instanciar un Alojamiento disponible
const apartamento1 = new Alojamiento(
  101,
  "Apartamento Cerca a la Universidad",
  "Habitación amoblada con baño privado y todos los servicios incluidos.",
  "Calle 123 #45-67",
  "Bogotá",
  "Chapinero",
  "10 minutos",
  4.6097,
  -74.0817,
  "APARTAMENTO",
  1500000,
  45.0,
  1,
  2,
  ["Wifi", "Agua", "Luz", "Gas"],
  true,
  true,
  false,
  ["https://foto1.jpg", "https://foto2.jpg"]
);

console.log('--- 1. Creado Alojamiento ---');
console.log(`Alojamiento ID: ${apartamento1.getId()}`);
console.log(`¿Está disponible?: ${apartamento1.estaDisponible()}`);

// 2. Instanciar un Inquilino
const inquilino1 = new Inquilino(1, "Carlos Pérez", "carlos.perez@email.com");

console.log('\n--- 2. Guardando Alojamiento en Favoritos ---');
inquilino1.guardarFavorito(apartamento1);
console.log(`Favoritos actualizados: ${inquilino1.getFavoritos().length} elemento(s)`);

// 3. Crear una Solicitud de Reserva por el Inquilino
console.log('\n--- 3. Creación de Solicitud de Reserva ---');
const fechaInicio = new Date('2026-10-01');
const fechaFin = new Date('2026-10-15');

const solicitud1 = inquilino1.crearSolicitud(
  501,
  fechaInicio,
  fechaFin,
  "Hola, me interesa arrendar el espacio durante las primeras semanas de octubre."
);

console.log(`Solicitud ID: ${solicitud1.getId()}`);
console.log(`Mensaje enviado: "${solicitud1.getMensaje()}"`);
console.log(`Estado inicial de la solicitud: ${solicitud1.getEstado()}`);

// 4. Aceptar la Solicitud (Proceso del Propietario)
console.log('\n--- 4. Procesamiento de la Solicitud ---');
solicitud1.aceptarSolicitud();
console.log(`Nuevo estado de la solicitud: ${solicitud1.getEstado()}`);

// 5. Creación y Confirmación de la Reserva final
console.log('\n--- 5. Confirmación de la Reserva ---');
const reserva1 = new Reserva(
  901,
  fechaInicio,
  fechaFin,
  50000, // Precio por día
  new Date()
);

// Descontar o marcar el alojamiento como reservado
apartamento1.reservar();
reserva1.confirmarReserva();

console.log(`Estado actual del Alojamiento: ${apartamento1.getEstado()}`);
console.log(`¿Sigue el alojamiento disponible?: ${apartamento1.estaDisponible()}`);
console.log(`Estado final de la Reserva: ${reserva1.getEstado()}`);
console.log(`Cálculo total de la estancia: $${reserva1.calcularTotal(400000,3)}`);