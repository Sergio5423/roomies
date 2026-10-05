import { apiClient } from '../../infrastructure/api/apiClient';

// Definimos un modelo rápido para el Roommate
export interface Roommate {
  id: string;
  nombre: string;
  edad: number;
  presupuestoMax: number;
  ocupacion: string;
  descripcion: string;
}

export const RoommateService = {
  obtenerTodos: async (): Promise<Roommate[]> => {
    try {
      // Intenta conectar al backend real
      const response = await apiClient<{ data: Roommate[] }>('/api/roommates', { 
        method: 'GET' 
      });
      return response.data || [];
    } catch (error) {
      console.warn("Backend de roommates no disponible, usando datos de prueba.");
      // Datos mockeados para no romper el diseño mientras el backend se conecta
      return [
        { id: "1", nombre: "Carlos", edad: 25, presupuestoMax: 300, ocupacion: "Desarrollador", descripcion: "Busco depa tranquilo, cero fiestas, trabajo remoto." },
        { id: "2", nombre: "Ana", edad: 22, presupuestoMax: 250, ocupacion: "Estudiante", descripcion: "Busco compartir con chicas cerca a la universidad. Me gustan los gatos." },
        { id: "3", nombre: "Diego", edad: 28, presupuestoMax: 400, ocupacion: "Ingeniero", descripcion: "Busco roomie responsable para alquilar un apartamento de 2 habitaciones." },
      ];
    }
  }
};