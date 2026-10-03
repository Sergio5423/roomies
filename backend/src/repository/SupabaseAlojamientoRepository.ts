import type { IAlojamientoRepository } from './IAlojamientoRepository';
import { Alojamiento } from '../models/Alojamiento/Alojamiento';
import { AlojamientoMapper } from './AlojamientoMapper';
import { supabase } from '../config/supabase';

export class SupabaseAlojamientoRepository implements IAlojamientoRepository {

async guardar(alojamiento: Alojamiento, propietarioId: string): Promise<Alojamiento> {
  const { data, error } = await supabase
    .from('housing')
    .insert({
      id: alojamiento.getId(),
      landlord_id: propietarioId, // 👈 Usar la variable pasada por parámetro
      title: alojamiento.getTitulo(),
      description: alojamiento.getDescripcion(),
      type: alojamiento.getTipoAlojamiento().getNombre(),
      images: alojamiento.getImagenes(),
      average_rating: alojamiento.getPuntuacionPromedio(),
      status: alojamiento.getEstado(),
      location: {
        direccion: alojamiento.getUbicacion().getDireccion(),
        ciudad: alojamiento.getUbicacion().getCiudad(),
        barrio: alojamiento.getUbicacion().getBarrio(),
        distancia: alojamiento.getUbicacion().getDistancia(),
        latitud: alojamiento.getUbicacion().getLatitud(),
        longitud: alojamiento.getUbicacion().getLongitud()
      },
      features: {
        numeroCuartos: alojamiento.getCaracteristicas().getNumeroCuartos(),
        metrosCuadrados: alojamiento.getCaracteristicas().getMetrosCuadrados(),
        capacidad: alojamiento.getCaracteristicas().getCapacidad(),
        amoblado: alojamiento.getCaracteristicas().getAmoblado(),
        buscandoRoomie: alojamiento.getCaracteristicas().getBuscandoRoomie()
      },
      price: {
        precioMensual: alojamiento.getPrecio().getPrecioMensual()
      }
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error al guardar la publicación: ${error.message}`);
  }

  return alojamiento;
}

  async obtenerPorId(id: string): Promise<Alojamiento | null> {
    const { data, error } = await supabase
      .from('housing')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return AlojamientoMapper.desdeRegistro(data);
  }

  async listarTodos(): Promise<Alojamiento[]> {
    const { data, error } = await supabase
      .from('housing')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((h) => AlojamientoMapper.desdeRegistro(h));
  }

  async actualizar(alojamiento: Alojamiento): Promise<Alojamiento> {
    const { error } = await supabase
      .from('housing')
      .update({
        title: alojamiento.getTitulo(),
        description: alojamiento.getDescripcion(),
        type: alojamiento.getTipoAlojamientoNombre(),
        images: alojamiento.getImagenes(),
        status: alojamiento.getEstado(),
        location: alojamiento.getUbicacion(),
        features: alojamiento.getCaracteristicas(),
        price: alojamiento.getPrecio(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', alojamiento.getId());

    if (error) {
      throw new Error(`Error al actualizar el alojamiento: ${error.message}`);
    }

    return alojamiento;
  }

  async eliminar(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('housing')
      .delete()
      .eq('id', id);

    return !error;
  }
}