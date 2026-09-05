export class Solicitud {
  private id: number;
  private fechaSolicitud: Date;
  private fechaInicioSolicitada: Date;
  private fechaFinSolicitada: Date;
  private mensaje: string;
  private estado: string;

  constructor(
    id: number,
    fechaSolicitud: Date,
    fechaInicioSolicitada: Date,
    fechaFinSolicitada: Date,
    mensaje: string,
    estado: string = 'PENDIENTE'
  ) {
    this.id = id;
    this.fechaSolicitud = fechaSolicitud;
    this.fechaInicioSolicitada = fechaInicioSolicitada;
    this.fechaFinSolicitada = fechaFinSolicitada;
    this.mensaje = mensaje;
    this.estado = estado;
  }

  // Getters para consultar la información
  public getId(): number {
    return this.id;
  }

  public getEstado(): string {
    return this.estado;
  }

  public getMensaje(): string {
    return this.mensaje;
  }

  // Implementación de métodos del UML
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
}