import { Alojamiento } from "./Alojamiento/Alojamiento";

export class PublicacionRoomie {
  private id: number;
  private descripcion: string;
  //private presupuestoMinimo: number;
  //private presupuestoMaximo: number;
  private fecha: Date;
  private estado: string;
  private alojamiento: Alojamiento;

  constructor(
    id: number,
    descripcion: string,
    fecha: Date,
    estado: string,
    alojamiento: Alojamiento
  ) {
    this.id = id;
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.estado = estado;
    this.alojamiento = alojamiento;     
  }

  public actualizarEstado(nuevoEstado: string): void {
    this.estado = nuevoEstado;
  }

  public getId(): number { return this.id }
  public getDescripcion(): string { return this.descripcion }
  public getFecha(): Date { return this.fecha }
  public getEstado(): string { return this.estado }
  public getAlojamiento(): Alojamiento { return this.alojamiento }
}