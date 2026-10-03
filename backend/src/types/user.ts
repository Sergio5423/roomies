export type UserRole = 'ESTUDIANTE' | 'ARRENDATARIO';

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}