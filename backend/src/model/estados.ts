// src/model/estados.ts
//
// Antipatrón corregido (Fase 7 del plan de refactorización — ver backend/README.md,
// Problema 8): los campos "estado" de Alojamiento, Usuario, Solicitud, Reserva y
// PublicacionRoomie eran "string" libres — el compilador no impedía un valor inválido ni
// un typo (p. ej. "pendiente" en minúscula), y cada clase revalidaba sus transiciones
// comparando texto sin ninguna garantía de tipo.
//
// Corrección aplicada: se reemplaza "string" por un enum específico por entidad. Los
// valores de cada enum son exactamente los strings que ya se usaban en el código — no se
// inventan estados nuevos ni se cambia ninguna regla de transición, solo el tipo del
// campo. Se pueden seguir agregando valores a estos enums cuando el dominio los necesite.
export enum EstadoAlojamiento {
  DISPONIBLE = "Disponible",
  OCUPADO = "Ocupado",
}

export enum EstadoUsuario {
  ACTIVO = "Activo",
}

export enum EstadoSolicitud {
  PENDIENTE = "PENDIENTE",
  ACEPTADA = "ACEPTADA",
  RECHAZADA = "RECHAZADA",
  CANCELADA = "CANCELADA",
}

export enum EstadoReserva {
  PENDIENTE = "PENDIENTE",
  CONFIRMADA = "CONFIRMADA",
  CANCELADA = "CANCELADA",
  FINALIZADA = "FINALIZADA",
}

export enum EstadoPublicacionRoomie {
  ACTIVA = "ACTIVA",
}
