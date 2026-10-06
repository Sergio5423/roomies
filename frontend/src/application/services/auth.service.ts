import { apiClient } from '../../infrastructure/api/apiClient';

export const AuthService = {
  login: async (email: string, password: string) => {
    // Esto conectará con tu backend cuando tengas el endpoint de login listo
    // Retornamos un token o los datos del usuario
    const response = await apiClient<{ token: string; usuario: any }>('/api/auth/login', {
      method: 'POST',
      bodyData: { email, password }
    });
    return response;
  }
};