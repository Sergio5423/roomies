import { Alojamiento } from "./Alojamiento/Alojamiento";
// NOTA (Fase 7): "estado" pasó de "string" a EstadoPublicacionRoomie (ver Problema 8 del
// informe de auditoría) — mismos valores usados hasta ahora, ahora verificados en compilación.
import { EstadoPublicacionRoomie } from "./estados";

export class PublicacionRoomie {
  private id: number;
  private descripcion: string;
  //private presupuestoMinimo: number;
  //private presupuestoMaximo: number;
  private fecha: Date;
  private estado: EstadoPublicacionRoomie;
  private alojamiento: Alojamiento;

  constructor(
    id: number,
    descripcion: string,
    fecha: Date,
    estado: EstadoPublicacionRoomie,
    alojamiento: Alojamiento
  ) {
    this.id = id;
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.estado = estado;
    this.alojamiento = alojamiento;
  }

  public actualizarEstado(nuevoEstado: EstadoPublicacionRoomie): void {
    this.estado = nuevoEstado;
  }

  public getId(): number { return this.id }
  public getDescripcion(): string { return this.descripcion }
  public getFecha(): Date { return this.fecha }
  public getEstado(): EstadoPublicacionRoomie { return this.estado }
  public getAlojamiento(): Alojamiento { return this.alojamiento }
}