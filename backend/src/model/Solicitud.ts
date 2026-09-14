import { Alojamiento } from './Alojamiento/Alojamiento'
// NOTA (Fase 7): "estado" pasó de "string" a EstadoSolicitud (ver Problema 8 del informe
// de auditoría) — mismos valores y transiciones ya usados, ahora verificados en compilación.
import { EstadoSolicitud } from './estados'

export class Solicitud {
  private id: number;
  private fechaSolicitud: Date;
  private estado: EstadoSolicitud;
  private alojamiento: Alojamiento;

  constructor(
    id: number,
    fechaSolicitud: Date,
    estado: EstadoSolicitud = EstadoSolicitud.PENDIENTE,
    alojamiento: Alojamiento
  ) {
    this.id = id;
    this.fechaSolicitud = fechaSolicitud;
    this.estado = estado;
    this.alojamiento = alojamiento;
  }

  public aceptarSolicitud(): void {
    if (this.estado !== EstadoSolicitud.PENDIENTE) {
      throw new Error(`No se puede aceptar una solicitud en estado: ${this.estado}`);
    }
    this.estado = EstadoSolicitud.ACEPTADA;
  }

  public rechazarSolicitud(): void {
    if (this.estado !== EstadoSolicitud.PENDIENTE) {
      throw new Error(`No se puede rechazar una solicitud en estado: ${this.estado}`);
    }
    this.estado = EstadoSolicitud.RECHAZADA;
  }

  public cancelarSolicitud(): void {
    if (this.estado === EstadoSolicitud.ACEPTADA) {
      throw new Error('No se puede cancelar una solicitud que ya fue aceptada. Debes cancelar la reserva.');
    }
    this.estado = EstadoSolicitud.CANCELADA;
  }

  public getId(): number { return this.id; }
  public getEstado(): EstadoSolicitud { return this.estado; }
  public getAlojamiento(): Alojamiento { return this.alojamiento }
}