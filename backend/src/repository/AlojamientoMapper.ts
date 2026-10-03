import { AlojamientoBuilder } from '../models/Builder/AlojamientoBuilder';
import { TipoAlojamientoFactory } from '../models/Factory/TipoAlojamientoFactory';
import { Ubicacion } from '../models/Alojamiento/Ubicacion';
import { Caracteristica } from '../models/Alojamiento/Caracteristica';
import { Precio } from '../models/Alojamiento/Precio';

export interface AlojamientoRegistro {
  id: string;
  title: string;
  description: string;
  type: string;
  images?: string[] | null;
  average_rating?: number | null;
  created_at: string;
  status: string;
  location: {
    direccion: string; ciudad: string; barrio?: string; distancia?: string;
    latitud: number; longitud: number;
  };
  features: {
    numeroCuartos: number; metrosCuadrados: number; capacidad: number;
    amoblado: boolean; buscandoRoomie: boolean;
  };
  price: { precioMensual?: number; monto?: number } | number;
}

/** Traduce el registro persistido; el Builder ensambla el objeto de dominio. */
export class AlojamientoMapper {
  static desdeRegistro(data: AlojamientoRegistro) {
    const u = data.location;
    const c = data.features;
    return new AlojamientoBuilder()
      .conIdentidad(data.id)
      .conDescripcion(data.title, data.description)
      .conTipo(TipoAlojamientoFactory.crear(data.type))
      .conImagenes(data.images ?? [])
      .conPuntuacion(data.average_rating ?? 0)
      .conPublicacion(new Date(data.created_at), data.status)
      .conUbicacion(new Ubicacion(u.direccion, u.ciudad, u.barrio ?? '',
        u.distancia ?? '', Number(u.latitud), Number(u.longitud)))
      .conCaracteristicas(new Caracteristica(Number(c.numeroCuartos), Number(c.metrosCuadrados),
        Number(c.capacidad), c.amoblado, c.buscandoRoomie))
      .conPrecio(new Precio(Number(typeof data.price === 'number'
        ? data.price : data.price.precioMensual ?? data.price.monto)))
      .construir();
  }
}
