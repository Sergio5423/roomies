import { Alojamiento } from '../Alojamiento/Alojamiento';
import type { TipoAlojamiento } from '../Alojamiento/TipoAlojamiento';
import type { Ubicacion } from '../Alojamiento/Ubicacion';
import type { Caracteristica } from '../Alojamiento/Caracteristica';
import type { Precio } from '../Alojamiento/Precio';

/** Construye entidades completas sin regenerar identidad ni fecha al rehidratar. */
export class AlojamientoBuilder {
  private id?: string;
  private titulo?: string;
  private descripcion?: string;
  private tipo?: TipoAlojamiento;
  private imagenes: string[] = [];
  private puntuacion = 0;
  private fecha = new Date();
  private estado = 'disponible';
  private ubicacion?: Ubicacion;
  private caracteristicas?: Caracteristica;
  private precio?: Precio;

  conIdentidad(id: string): this { this.id = id; return this; }
  conDescripcion(titulo: string, descripcion: string): this {
    this.titulo = titulo; this.descripcion = descripcion; return this;
  }
  conTipo(tipo: TipoAlojamiento): this { this.tipo = tipo; return this; }
  conImagenes(imagenes: string[]): this { this.imagenes = [...imagenes]; return this; }
  conPuntuacion(puntuacion: number): this { this.puntuacion = puntuacion; return this; }
  conPublicacion(fecha: Date, estado: string): this {
    this.fecha = new Date(fecha); this.estado = estado; return this;
  }
  conUbicacion(ubicacion: Ubicacion): this { this.ubicacion = ubicacion; return this; }
  conCaracteristicas(caracteristicas: Caracteristica): this {
    this.caracteristicas = caracteristicas; return this;
  }
  conPrecio(precio: Precio): this { this.precio = precio; return this; }
  construir(): Alojamiento {
    if (!this.id?.trim() || !this.titulo?.trim() || this.descripcion === undefined ||
        !this.tipo || !this.ubicacion || !this.caracteristicas || !this.precio) {
      throw new Error('Faltan datos obligatorios para construir el alojamiento.');
    }
    if (!Number.isFinite(this.precio.getPrecioMensual()) || this.precio.getPrecioMensual() < 0) {
      throw new Error('El precio debe ser un número finito no negativo.');
    }
    if (!Number.isFinite(this.fecha.getTime())) throw new Error('Fecha de publicación inválida.');
    return new Alojamiento(this.id, this.titulo, this.descripcion, this.tipo,
      [...this.imagenes], this.puntuacion, new Date(this.fecha), this.estado,
      this.ubicacion, this.caracteristicas, this.precio);
  }
}
