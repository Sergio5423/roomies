import { Alojamiento } from './Alojamiento/Alojamiento'
import { Inquilino } from './Usuario/Inquilino'

export class Reserva {
  private id: number;
  private fechaInicioConfirmada: Date;
  private fechaFinConfirmada: Date;
  private precioAcordado: number;
  private fechaReserva: Date;
  private estado: string;
  private alojamiento: Alojamiento;
  private inquilino: Inquilino;

  constructor(
    id: number,
    fechaInicioConfirmada: Date,
    fechaFinConfirmada: Date,
    precioAcordado: number,
    fechaReserva: Date,
    estado: string = 'PENDIENTE',
    alojamiento: Alojamiento,
    inquilino: Inquilino
  ) {
    this.id = id;
    this.fechaInicioConfirmada = fechaInicioConfirmada;
    this.fechaFinConfirmada = fechaFinConfirmada;
    this.precioAcordado = precioAcordado;
    this.fechaReserva = fechaReserva;
    this.estado = estado;
    this.alojamiento = alojamiento;
    this.inquilino = inquilino;
  }

  public reservar(): void {
    if (this.estado !== 'PENDIENTE') {
      throw new Error(`No se puede iniciar la reserva. Estado actual: ${this.estado}`);
    }
    this.fechaReserva = new Date();
    this.estado = 'PENDIENTE';
  }

  public confirmarReserva(): void {
    if (this.estado === 'CANCELADA') {
      throw new Error('No se puede confirmar una reserva que ha sido cancelada.');
    }
    this.estado = 'CONFIRMADA';
  }

  public cancelarReserva(): void {
    if (this.estado === 'FINALIZADA') {
      throw new Error('No se puede cancelar una reserva que ya ha finalizado.');
    }
    this.estado = 'CANCELADA';
  }

  public getId(): number { return this.id; }
  public getEstado(): string { return this.estado; }
  public getAlojamiento(): Alojamiento { return this.alojamiento; }
  public getPrecioAcordado(): string { return this.precioAcordado.toString(); }
}