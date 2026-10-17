import { apiClient } from '../../infrastructure/api/apiClient';

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'ESTUDIANTE' | 'ARRENDATARIO' | string;
}

export interface LoginResponse {
  message?: string;
  data?: {
    token: string;
    refreshToken?: string;
    user: any;
  };
  token?: string;
  usuario?: any;
  user?: any;
}

export const AuthService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient<LoginResponse>('/api/auth/login', {
      method: 'POST',
      bodyData: { email, password },
    });
    return response;
  },

  register: async (payload: RegisterPayload) => {
    const response = await apiClient<{
      message?: string;
      data?: {
        user: any;
        session?: { access_token: string };
      };
    }>('/api/auth/register', {
      method: 'POST',
      bodyData: payload,
    });
    return response;
  },
};