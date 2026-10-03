import { supabase } from '../config/supabase';
import type { RegisterDTO, LoginDTO, Profile } from '../types/user';

export class AuthService {
  /**
   * RF-001: Registro de usuario y creación de perfil[cite: 1]
   */
  static async register(data: RegisterDTO) {
    const { email, password, first_name, last_name, phone, role } = data;

    // 1. Crear el usuario en Supabase Auth enviando la metadata para el Trigger
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          phone,
          role,
        },
      },
    });

    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Error al registrar el usuario en Auth.');
    }

    // 2. Esperar/Consultar el perfil recién creado por el Trigger
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      // Retornar al menos la información enviada si la consulta inmediata del trigger demora milisegundos
      return {
        user: {
          id: authData.user.id,
          email,
          first_name,
          last_name,
          phone,
          role,
        },
        session: authData.session,
      };
    }

    return {
      user: profile as Profile,
      session: authData.session,
    };
  }

  /**
   * RF-002: Inicio de sesión y generación de Tokens[cite: 1]
   */
  static async login(data: LoginDTO) {
    const { email, password } = data;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user || !authData.session) {
      throw new Error('Credenciales inválidas o error al iniciar sesión.');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('No se encontró el perfil asociado a este usuario.');
    }

    return {
      token: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      user: profile as Profile,
    };
  }
}