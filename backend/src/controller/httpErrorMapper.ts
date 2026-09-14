// src/controller/httpErrorMapper.ts
//
// Antipatrón corregido (Fase 4 del plan de refactorización — ver backend/README.md, Problema 6):
// cada método de cada controlador fijaba su propio código HTTP de error por convención
// ("cambiarEstado" -> 400, "obtener" -> 404), en vez de decidirlo por el tipo real del error.
// Esta función centraliza esa decisión en un único lugar.
import { NotFoundError } from "../model/errors.js";

export function mapErrorToHttpStatus(error: unknown): number {
  if (error instanceof NotFoundError) {
    return 404;
  }
  // Comportamiento preexistente para el resto de errores (duplicados, validaciones de rol,
  // etc.): se conserva 400, igual que antes de esta fase, porque esos casos no fueron
  // identificados como incorrectos en la auditoría.
  return 400;
}
