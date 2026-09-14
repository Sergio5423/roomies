import { Inquilino } from './Usuario/Inquilino'

export class Resena {
  private id: number;
  private puntuacion: number;
  private comentario: string;
  private fecha: Date;
  private inquilino: Inquilino;

  constructor(
    id: number,
    puntuacion: number,
    comentario: string,
    fecha: Date,
    inquilino: Inquilino
  ) {
    this.id = id;
    this.puntuacion = puntuacion;
    this.comentario = comentario;
    this.fecha = fecha;
    this.inquilino = inquilino;
  }

  public getAutor(): string { return this.inquilino.getNombreCompleto(); }
  public getPuntuacion(): string { return this.puntuacion.toString() }
  public getComentario(): string { return this.comentario }
  public getFecha(): Date { return this.fecha; }
}
