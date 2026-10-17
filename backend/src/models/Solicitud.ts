import { Alojamiento } from './Alojamiento/Alojamiento'

export class Solicitud {
  private id: number;
  private fechaSolicitud: Date;
  private estado: string;
  private alojamiento: Alojamiento;

  constructor(
    id: number,
    fechaSolicitud: Date,
    estado: string = 'PENDIENTE',
    alojamiento: Alojamiento
  ) {
    this.id = id;
    this.fechaSolicitud = fechaSolicitud;
    this.estado = estado;
    this.alojamiento = alojamiento;
  }

  public aceptarSolicitud(): void {
    if (this.estado !== 'PENDIENTE') {
      throw new Error(`No se puede aceptar una solicitud en estado: ${this.estado}`);
    }
    this.estado = 'ACEPTADA';
  }

  public rechazarSolicitud(): void {
    if (this.estado !== 'PENDIENTE') {
      throw new Error(`No se puede rechazar una solicitud en estado: ${this.estado}`);
    }
    this.estado = 'RECHAZADA';
  }

  public cancelarSolicitud(): void {
    if (this.estado === 'ACEPTADA') {
      throw new Error('No se puede cancelar una solicitud que ya fue aceptada. Debes cancelar la reserva.');
    }
    this.estado = 'CANCELADA';
  }

  public getId(): number { return this.id; }
  public getEstado(): string { return this.estado; }
  public getAlojamiento(): Alojamiento { return this.alojamiento }
}