// src/model/errors.ts
//
// Antipatrón corregido (Fase 4 del plan de refactorización — ver backend/README.md, Problema 6):
// los controladores traducían errores a códigos HTTP según el método que los capturaba
// (p. ej. "cambiarEstado" siempre respondía 400, "obtener" siempre 404), sin importar el
// tipo real del error. Un mismo error de negocio ("no encontrado") terminaba traduciéndose
// de forma inconsistente según desde qué método se hubiera lanzado.
//
// Corrección aplicada: se introduce un tipo de error de dominio explícito para el caso
// "no encontrado", de modo que el controlador pueda decidir el código HTTP según el TIPO
// del error (ver src/controller/httpErrorMapper.ts) y no según una convención por método.
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
