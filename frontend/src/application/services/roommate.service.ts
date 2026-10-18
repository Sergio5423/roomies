import { apiClient } from '../../infrastructure/api/apiClient';

export interface EstudianteRoomie {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
}

export interface UbicacionRoomie {
  direccion: string;
  ciudad: string;
  barrio?: string;
  distancia?: string;
  latitud?: number;
  longitud?: number;
}

export interface CaracteristicasRoomie {
  numeroCuartos: number;
  metrosCuadrados: number;
  capacidad?: number;
  amoblado?: boolean;
  buscandoRoomie?: boolean;
}

export interface AlojamientoRoomie {
  id: string;
  titulo: string;
  tipo: string;
  precio: number;
  ubicacion: UbicacionRoomie;
  caracteristicas: CaracteristicasRoomie;
}

export interface PublicacionRoomie {
  id: string;
  descripcion: string;
  estado: string;
  fecha: string;
  alojamiento: AlojamientoRoomie;
}

export interface EstudianteConRoomies {
  estudiante: EstudianteRoomie;
  publicacionesRoomie: PublicacionRoomie[];
}

export interface RoomiesActivosResponse {
  mensaje: string;
  data: EstudianteConRoomies[];
}

export const RoommateService = {
  /**
   * Obtiene la lista de estudiantes y alojamientos buscando roomie
   * GET /api/users/roomies/activos
   */
  obtenerRoomiesActivos: async (token?: string): Promise<EstudianteConRoomies[]> => {
    const response = await apiClient<RoomiesActivosResponse>('/api/users/roomies/activos', {
      method: 'GET',
      token,
    });
    if (response && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  /**
   * Alias de compatibilidad
   */
  obtenerTodos: async (token?: string): Promise<EstudianteConRoomies[]> => {
    return await RoommateService.obtenerRoomiesActivos(token);
  },
};