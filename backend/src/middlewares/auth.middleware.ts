import type { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import type { Profile } from '../types/user';

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer <TOKEN>"

    if (!token) {
      res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token de autenticación.' });
      return;
    }

    // 1. Validar el token con el cliente de Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Token inválido o expirado.' });
      return;
    }

    // 2. Obtener el perfil extendido para extraer el rol actual
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      res.status(404).json({ error: 'Perfil de usuario no encontrado.' });
      return;
    }

    // 3. Adjuntar la información del usuario a la petición
    req.user = profile as Profile;
    next();
  } catch (error: any) {
    res.status(500).json({ error: 'Error al procesar la autenticación.' });
  }
};