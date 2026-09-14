import type { TipoAlojamiento } from "./ITipoAlojamiento";
import { Caracteristica } from "./Caracteristica";
import { Precio } from "./Precio";
import { Ubicacion } from "./Ubicacion";
import { Regla } from "./Regla"
// NOTA (Fase 7): "estado" pasó de "string" a EstadoAlojamiento (ver Problema 8 del informe
// de auditoría) — mismos valores usados hasta ahora, ahora verificados en compilación.
import { EstadoAlojamiento } from "../estados";

export class Alojamiento {
  private readonly id: number;
  // NOTA (Fase 8): se agrega "propietarioId" para que el Alojamiento (y su repositorio)
  // sean la única fuente de verdad de la relación Propietario<->Alojamiento (ver
  // Problema 9 del informe de auditoría) — antes esa relación también se duplicaba como
  // un arreglo dentro de la entidad Propietario.
  private readonly propietarioId: number;
  private titulo: string;
  private descripcion: string;
  private tipoAlojamiento: TipoAlojamiento;
  private imagenes: string[];
  private puntuacionPromedio: number;
  private readonly fechaPublicacion: Date;
  private estado: EstadoAlojamiento;
  private ubicacion: Ubicacion;
  private caracteristicas: Caracteristica;
  private precio: Precio;

  constructor(
    id: number,
    propietarioId: number,
    titulo: string,
    descripcion: string,
    tipoAlojamiento: TipoAlojamiento,
    imagenes: string[],
    puntuacionPromedio: number,
    fechaPublicacion: Date,
    estado: EstadoAlojamiento,
    ubicacion: Ubicacion,
    caracteristicas: Caracteristica,
    precio: Precio
  ) {
    this.id = id;
    this.propietarioId = propietarioId;
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

  public actualizarEstado(nuevoEstado: EstadoAlojamiento): void {
    this.estado = nuevoEstado;
  }

  public getId(): number { return this.id; }
  public getPropietarioId(): number { return this.propietarioId; }
  public getTitulo(): string { return this.titulo; }
  public getDescripcion(): string { return this.descripcion; }
  public getTipoAlojamiento(): TipoAlojamiento { return this.tipoAlojamiento; }
  public getImagenes(): string[] { return [...this.imagenes]; }
  public getPuntuacionPromedio(): number { return this.puntuacionPromedio; }
  public getFechaPublicacion(): Date { return this.fechaPublicacion; }
  public getEstado(): EstadoAlojamiento { return this.estado; }
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