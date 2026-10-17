import type { TipoAlojamiento } from "./TipoAlojamiento";
import { Caracteristica } from "./Caracteristica";
import { Precio } from "./Precio";
import { Ubicacion } from "./Ubicacion";
import { Regla } from "./Regla";

export class Alojamiento {
  private readonly id: string;
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
  public landlord_id?: string;
  public propietarioId?: string;

  constructor(
    id: string,
    titulo: string,
    descripcion: string,
    tipoAlojamiento: TipoAlojamiento,
    imagenes: string[],
    puntuacionPromedio: number,
    fechaPublicacion: Date,
    estado: string,
    ubicacion: Ubicacion,
    caracteristicas: Caracteristica,
    precio: Precio,
    landlord_id?: string
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
    this.landlord_id = landlord_id;
    this.propietarioId = landlord_id;
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
    if (datos.landlord_id) {
      this.landlord_id = datos.landlord_id;
      this.propietarioId = datos.landlord_id;
    }
  }

  public actualizarEstado(nuevoEstado: string): void {
    this.estado = nuevoEstado;
  }

  public getId(): string { return this.id; }
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
  public getLandlordId(): string | undefined { return this.landlord_id || this.propietarioId; }
  public getPropietarioId(): string | undefined { return this.propietarioId || this.landlord_id; }

  public getTipoAlojamientoNombre(): string {
    return this.tipoAlojamiento.getNombre();
  }

  public getRequiereContratoAnual(): boolean {
    return this.tipoAlojamiento.getContratoAnual();
  }

  public getServiciosIncluidos(): string[] {
    return this.tipoAlojamiento.getServicios();
  }

  public getReglas(): Regla[] {
    return this.tipoAlojamiento.getReglas();
  }
}
