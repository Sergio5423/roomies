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
}