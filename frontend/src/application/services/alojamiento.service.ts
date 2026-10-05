import { apiClient } from '../../infrastructure/api/apiClient';
import type { Alojamiento } from '../../domain/models/Alojamiento';

export const AlojamientoService = {
  obtenerTodos: async (): Promise<Alojamiento[]> => {
    // Asumimos que tu backend devuelve { data: [...] } o directamente el array
    const response = await apiClient<{ data: Alojamiento[] }>('/api/alojamientos', { 
      method: 'GET' 
    });
    return response.data || [];
  },

  publicar: async (datos: Omit<Alojamiento, 'id' | 'estado'>): Promise<Alojamiento> => {
    const response = await apiClient<{ data: Alojamiento }>('/api/alojamientos', { 
      method: 'POST', 
      bodyData: datos 
    });
    return response.data;
  }
};