import { apiClient } from '../../infrastructure/api/apiClient';

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
}

export const AuthService = {
  login: async (email: string, password: string) => {
    const response = await apiClient<{ token: string; usuario: any }>('/api/auth/login', {
      method: 'POST',
      bodyData: { email, password }
    });
    return response;
  },

  register: async (payload: RegisterPayload) => {
    const response = await apiClient<{ token?: string; usuario?: any; mensaje?: string }>('/api/auth/register', {
      method: 'POST',
      bodyData: payload
    });
    return response;
  }
};