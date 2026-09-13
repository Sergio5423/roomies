import type { TipoAlojamiento } from "./ITipoAlojamiento";
import { Caracteristica } from "./Caracteristica";
import { Precio } from "./Precio";
import { Ubicacion } from "./Ubicacion";
import { Regla } from "./Regla"

export class Alojamiento {
  private readonly id: number;
  private titulo: string;
  private descripcion: string;
  private tipoAlojamiento: TipoAlojamiento;
  private imagenes: string[];
  private puntuacionPromedio: number;
  private readonly fechaPublicacion: Date;
  private estado: string;
  private ubicacion: Ubicacion;
  private caracteristicas: Caracteristica;
  private precio: Precio;

  constructor(
    id: number,
    titulo: string,
    descripcion: string,
    tipoAlojamiento: TipoAlojamiento,
    imagenes: string[],
    puntuacionPromedio: number,
    fechaPublicacion: Date,
    estado: string,
    ubicacion: Ubicacion,
    caracteristicas: Caracteristica,
    precio: Precio
  ) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.tipoAlojamiento = tipoAlojamiento;
    this.imagenes = imagenes;
    this.puntuacionPromedio = puntuacionPromedio;
    this.fechaPublicacion = fechaPublicacion;
    this.estado = estado;
    this.ubicacion = ubicacion;
    this.caracteristicas = caracteristicas;
    this.precio = precio;
  }

  public actualizarAlojamiento(datos: Alojamiento): void {
    this.titulo = datos.titulo;
    this.descripcion = datos.descripcion;
    this.tipoAlojamiento = datos.tipoAlojamiento;
    this.imagenes = datos.imagenes;
    this.puntuacionPromedio = datos.puntuacionPromedio;
    this.ubicacion = datos.ubicacion;
    this.caracteristicas = datos.caracteristicas;
    this.precio = datos.precio;
  }

  public cambiarEstado(nuevoEstado: string): void {
    this.estado = nuevoEstado;
  }

  public getId(): number { return this.id; }
  public getTitulo(): string { return this.titulo; }
  public getDescripcion(): string { return this.descripcion; }
  public getTipoAlojamiento(): TipoAlojamiento { return this.tipoAlojamiento; }
  public getImagenes(): string[] { return [...this.imagenes]; }
  public getPuntuacionPromedio(): number { return this.puntuacionPromedio; }
  public getFechaPublicacion(): Date { return this.fechaPublicacion; }
  public getEstado(): string { return this.estado; }
  public getUbicacion(): Ubicacion { return this.ubicacion; }
  public getCaracteristicas(): Caracteristica { return this.caracteristicas; }
  public getPrecio(): Precio { return this.precio; }

  public getTipoAlojamientoNombre(): string {
    return this.tipoAlojamiento.getNombreTipo();
  }

  public getRequiereContratoAnual(): boolean {
    return this.tipoAlojamiento.requiereContratoAnual();
  }

  public getServiciosIncluidos(): string[] {
    return this.tipoAlojamiento.getServiciosIncluidos();
  }

  public getReglas(): Regla[] {
    return this.tipoAlojamiento.getReglas();
  }
}