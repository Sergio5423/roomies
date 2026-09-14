// NOTA (Fase 9 del plan de refactorización — ver backend/README.md, Problema 10): esta
// clase no tenía ningún método de lectura público — sus datos eran de solo escritura, algo
// inconsistente con el resto del dominio. Se agregan los getters siguiendo el mismo estilo
// ya usado en clases como Precio o Caracteristica; no cambia ninguna regla existente.
export class Resena {
  private id: number;
  private puntuacion: number;
  private comentario: string;
  private fecha: Date;

  constructor(
    id: number,
    puntuacion: number,
    comentario: string,
    fecha: Date
  ) {
    this.id = id;
    this.puntuacion = puntuacion;
    this.comentario = comentario;
    this.fecha = fecha;
  }

  public getId(): number { return this.id; }
  public getPuntuacion(): number { return this.puntuacion; }
  public getComentario(): string { return this.comentario; }
  public getFecha(): Date { return this.fecha; }
}