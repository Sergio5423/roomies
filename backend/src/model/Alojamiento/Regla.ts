// NOTA (Fase 9 del plan de refactorización — ver backend/README.md, Problema 10): esta
// clase no tenía ningún método de lectura público — sus datos eran de solo escritura, algo
// inconsistente con el resto del dominio. Se agregan los getters siguiendo el mismo estilo
// ya usado en clases como Precio o Caracteristica; no cambia ninguna regla existente.
export class Regla {
  private id: number;
  private nombre: string;
  private descripcion: string;

  constructor(
    id: number,
    nombre: string,
    descripcion: string,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  public getId(): number { return this.id; }
  public getNombre(): string { return this.nombre; }
  public getDescripcion(): string { return this.descripcion; }
}