import type { LandlordProfileDTO } from '../../domain/models/Alojamiento';
import { AuthService } from './auth.service';

export interface StoredUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'ESTUDIANTE' | 'ARRENDATARIO' | string;
  [key: string]: any;
}

const TOKEN_KEY = 'roomies_token';
const USER_KEY = 'roomies_user';
const AUTH_EVENT = 'roomies_auth_change';

export const AuthStore = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getUser(): StoredUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setAuth(token: string, user: StoredUser): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: { token, user } }));
    } catch (e) {
      console.error('Error saving auth to localStorage:', e);
    }
  },

  clearAuth(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: null }));
    } catch (e) {
      console.error('Error clearing auth:', e);
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  isArrendatario(): boolean {
    const user = this.getUser();
    return user?.role === 'ARRENDATARIO';
  },

  subscribe(callback: (user: StoredUser | null) => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const handler = () => {
      callback(this.getUser());
    };

    window.addEventListener(AUTH_EVENT, handler);
    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener(AUTH_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  },

  async login(email: string, password: string): Promise<{ token: string; user: StoredUser }> {
    const res = await AuthService.login(email, password);
    const token = res.data?.token || res.token;
    const user = res.data?.user || res.usuario || res.user;

    if (!token) {
      throw new Error('No se recibió el token de autenticación');
    }

    this.setAuth(token, user);
    return { token, user };
  },

  // Atajo para iniciar sesión de demostración instantánea
  async loginDemoArrendatario(): Promise<void> {
    await this.login('arrendatario1@gmail.com', '123456');
  },

  async loginDemoArrendatario2(): Promise<void> {
    await this.login('arrendatario2@gmail.com', '123456');
  },

  async loginDemoEstudiante(): Promise<void> {
    await this.login('estudiante2@gmail.com', '123456');
  }
};
