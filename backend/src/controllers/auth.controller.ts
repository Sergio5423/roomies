import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, first_name, last_name, role, phone } = req.body;

      // Validación básica
      if (!email || !password || !first_name || !last_name || !role) {
        res.status(400).json({ error: 'Todos los campos obligatorios deben ser proporcionados.' });
        return;
      }

      if (role !== 'ESTUDIANTE' && role !== 'ARRENDATARIO') {
        res.status(400).json({ error: 'El rol debe ser ESTUDIANTE o ARRENDATARIO.' });
        return;
      }

      const result = await AuthService.register({
        email,
        password,
        first_name,
        last_name,
        phone,
        role,
      });

      res.status(201).json({
        message: 'Usuario registrado exitosamente.',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error en el registro.' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email y contraseña son requeridos.' });
        return;
      }

      const result = await AuthService.login({ email, password });

      res.status(200).json({
        message: 'Inicio de sesión exitoso.',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Error al iniciar sesión.' });
    }
  }
}