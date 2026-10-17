import { apiClient } from '../../infrastructure/api/apiClient';
import type { LandlordProfileDTO } from '../../domain/models/Alojamiento';

export const UserService = {
  /**
   * Obtener perfil del usuario autenticado
   * GET /api/users/profile
   */
  obtenerPerfilPropio: async (): Promise<LandlordProfileDTO | null> => {
    try {
      const response = await apiClient<{ message?: string; data: LandlordProfileDTO }>(
        '/api/users/profile',
        { method: 'GET' }
      );
      return response.data || null;
    } catch (error) {
      console.warn('Error al obtener perfil propio:', error);
      return null;
    }
  },

  /**
   * Obtener perfil de un usuario/propietario por ID
   * GET /api/users/:id
   */
  obtenerPorId: async (id: string): Promise<LandlordProfileDTO | null> => {
    try {
      const response = await apiClient<{ message?: string; data: LandlordProfileDTO }>(
        `/api/users/${id}`,
        { method: 'GET' }
      );
      return response.data || null;
    } catch (error) {
      console.warn(`Error al consultar usuario con id ${id}:`, error);
      return null;
    }
  },
};
