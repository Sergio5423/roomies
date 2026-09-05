// src/model/PublicacionRoomie.ts

export class PublicacionRoomieModel {
  private id: number;
  private descripcionPresentacion: string;
  private presupuestoMinimo: number;
  private presupuestoMaximo: number;
  private carreraFiltro: string;
  private fechaPublicacion: Date;

  constructor(id: number, descripcionPresentacion: string, presupuestoMinimo: number, presupuestoMaximo: number, carreraFiltro: string, fechaPublicacion: Date) {
    this.id = id;
    this.descripcionPresentacion = descripcionPresentacion;
    this.presupuestoMinimo = presupuestoMinimo;
    this.presupuestoMaximo = presupuestoMaximo;
    this.carreraFiltro = carreraFiltro;
    this.fechaPublicacion = fechaPublicacion;
  }

  // Add methods for CRUD operations if needed
}