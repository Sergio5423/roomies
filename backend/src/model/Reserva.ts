import { Alojamiento } from './Alojamiento/Alojamiento'
// NOTA (Fase 7): "estado" pasó de "string" a EstadoReserva (ver Problema 8 del informe de
// auditoría) — mismos valores y transiciones ya usados, ahora verificados en compilación.
import { EstadoReserva } from './estados'

export class Reserva {
  private id: number;
  private fechaInicioConfirmada: Date;
  private fechaFinConfirmada: Date;
  private precioAcordado: number;
  private fechaReserva: Date;
  private estado: EstadoReserva;
  private alojamiento: Alojamiento;

  constructor(
    id: number,
    fechaInicioConfirmada: Date,
    fechaFinConfirmada: Date,
    precioAcordado: number,
    fechaReserva: Date,
    estado: EstadoReserva = EstadoReserva.PENDIENTE,
    alojamiento: Alojamiento
  ) {
    this.id = id;
    this.fechaInicioConfirmada = fechaInicioConfirmada;
    this.fechaFinConfirmada = fechaFinConfirmada;
    this.precioAcordado = precioAcordado;
    this.fechaReserva = fechaReserva;
    this.estado = estado;
    this.alojamiento = alojamiento;
  }

  public reservar(): void {
    if (this.estado !== EstadoReserva.PENDIENTE) {
      throw new Error(`No se puede iniciar la reserva. Estado actual: ${this.estado}`);
    }
    this.fechaReserva = new Date();
    this.estado = EstadoReserva.PENDIENTE;
  }

  public confirmarReserva(): void {
    if (this.estado === EstadoReserva.CANCELADA) {
      throw new Error('No se puede confirmar una reserva que ha sido cancelada.');
    }
    this.estado = EstadoReserva.CONFIRMADA;
  }

  public cancelarReserva(): void {
    if (this.estado === EstadoReserva.FINALIZADA) {
      throw new Error('No se puede cancelar una reserva que ya ha finalizado.');
    }
    this.estado = EstadoReserva.CANCELADA;
  }

  public getId(): number { return this.id; }
  public getEstado(): EstadoReserva { return this.estado; }
  public getAlojamiento(): Alojamiento { return this.alojamiento; }
}