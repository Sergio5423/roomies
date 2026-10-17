import { apiClient } from '../../infrastructure/api/apiClient';
import type {
  Alojamiento,
  CrearAlojamientoPayload,
  ActualizarAlojamientoPayload,
} from '../../domain/models/Alojamiento';

export const AlojamientoService = {
  /**
   * Listar todos los alojamientos disponibles públicamente
   * GET /api/alojamientos
   */
  obtenerTodos: async (): Promise<Alojamiento[]> => {
    try {
      const response = await apiClient<{ mensaje?: string; data: Alojamiento[] }>('/api/alojamientos', {
        method: 'GET',
      });
      return response.data || [];
    } catch (error) {
      console.error('Error al listar alojamientos:', error);
      return [];
    }
  },

  /**
   * Obtener detalle de un alojamiento por su ID
   * GET /api/alojamientos/:id
   */
  obtenerPorId: async (id: string): Promise<Alojamiento | null> => {
    try {
      const response = await apiClient<{ mensaje?: string; data: Alojamiento }>(`/api/alojamientos/${id}`, {
        method: 'GET',
      });
      return response.data || null;
    } catch (error) {
      console.error(`Error al obtener alojamiento con id ${id}:`, error);
      return null;
    }
  },

  /**
   * Publicar un nuevo alojamiento (requiere rol ARRENDATARIO)
   * POST /api/alojamientos
   */
  publicar: async (datos: CrearAlojamientoPayload): Promise<Alojamiento> => {
    const response = await apiClient<{ mensaje?: string; data: Alojamiento }>('/api/alojamientos', {
      method: 'POST',
      bodyData: datos,
    });
    return response.data;
  },

  /**
   * Actualizar un alojamiento existente (requiere rol ARRENDATARIO)
   * PUT /api/alojamientos/:id
   */
  actualizar: async (
    id: string,
    datos: ActualizarAlojamientoPayload
  ): Promise<Alojamiento> => {
    const response = await apiClient<{ mensaje?: string; data: Alojamiento }>(`/api/alojamientos/${id}`, {
      method: 'PUT',
      bodyData: datos,
    });
    return response.data;
  },

  /**
   * Cambiar el estado del alojamiento (ej: "disponible" u "ocupado")
   * PATCH /api/alojamientos/:id/estado
   */
  cambiarEstado: async (
    id: string,
    nuevoEstado: 'disponible' | 'ocupado' | string
  ): Promise<Alojamiento> => {
    const response = await apiClient<{ mensaje?: string; data: Alojamiento }>(
      `/api/alojamientos/${id}/estado`,
      {
        method: 'PATCH',
        bodyData: { nuevoEstado },
      }
    );
    return response.data;
  },

  /**
   * Duplicar un alojamiento existente para republicar o crear variante
   * POST /api/alojamientos/:id/duplicar
   * Incluye respaldo automático en caso de que el backend no tenga la ruta directa.
   */
  duplicar: async (
    id: string,
    fallbackAlojamiento?: Alojamiento
  ): Promise<Alojamiento> => {
    try {
      // 1. Intentar el endpoint nativo del backend
      const response = await apiClient<{ mensaje?: string; data: Alojamiento }>(
        `/api/alojamientos/${id}/duplicar`,
        {
          method: 'POST',
        }
      );
      if (response && response.data) {
        return response.data;
      }
    } catch (err: any) {
      console.warn(
        `Endpoint directo /duplicar falló o no está montado (${err.message}). Ejecutando duplicación de respaldo...`
      );
    }

    // 2. Si no respondió el endpoint directo, clonar mediante POST /api/alojamientos
    let fuente = fallbackAlojamiento;
    if (!fuente) {
      fuente = (await AlojamientoService.obtenerPorId(id)) || undefined;
    }

    if (!fuente) {
      throw new Error('No se pudo encontrar el alojamiento original para duplicar.');
    }

    // Extraer datos numéricos o estructurados
    const precioMensual =
      typeof fuente.precio === 'object' && fuente.precio !== null
        ? fuente.precio.precioMensual || (fuente.precio as any).monto || 0
        : Number(fuente.precio ?? 0);

    const tipoNombre =
      typeof fuente.tipoAlojamiento === 'object' && fuente.tipoAlojamiento !== null
        ? fuente.tipoAlojamiento.nombre || 'Apartamento'
        : (fuente.tipoAlojamiento as string) || fuente.tipo || 'Apartamento';

    const carac = fuente.caracteristicas || fuente.caracteristica || {
      numeroCuartos: 1,
      metrosCuadrados: 30,
      capacidad: 1,
      amoblado: true,
      buscandoRoomie: false,
    };

    const ubic = fuente.ubicacion || {
      direccion: 'Sin dirección',
      ciudad: 'Valledupar',
      barrio: 'Centro',
      distancia: 'Cerca a la U',
    };

    const reglasRaw = fuente.reglas || [];
    const reglasParsed: string[] = reglasRaw.map((r: any) =>
      typeof r === 'string' ? r : r.descripcion || String(r)
    );

    const payloadClon: CrearAlojamientoPayload = {
      titulo: fuente.titulo.startsWith('Copia de ')
        ? fuente.titulo
        : `Copia de ${fuente.titulo}`,
      descripcion: fuente.descripcion,
      tipoAlojamiento: tipoNombre,
      imagenes:
        fuente.imagenes && fuente.imagenes.length > 0
          ? fuente.imagenes
          : ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'],
      ubicacion: {
        direccion: ubic.direccion,
        ciudad: ubic.ciudad,
        barrio: ubic.barrio,
        distancia: ubic.distancia,
        latitud: ubic.latitud ?? 10.463,
        longitud: ubic.longitud ?? -73.253,
      },
      caracteristica: {
        numeroCuartos: carac.numeroCuartos ?? 1,
        metrosCuadrados: carac.metrosCuadrados ?? 30,
        capacidad: carac.capacidad ?? 1,
        amoblado: Boolean(carac.amoblado),
        buscandoRoomie: Boolean(carac.buscandoRoomie),
      },
      precio: {
        precioMensual,
      },
      reglas: reglasParsed.length > 0 ? reglasParsed : ['Convivencia responsable'],
    };

    return await AlojamientoService.publicar(payloadClon);
  },

  /**
   * Eliminar un alojamiento
   * DELETE /api/alojamientos/:id
   */
  eliminar: async (id: string): Promise<boolean> => {
    try {
      await apiClient<{ mensaje?: string }>(`/api/alojamientos/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (err: any) {
      console.warn(`Error al eliminar en backend endpoint DELETE:`, err);
      // Retornar true si fue eliminado o procesar el error
      throw err;
    }
  },
};