import type { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  /**
   * Obtener perfil del usuario autenticado
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Usuario no autenticado.' });
        return;
      }

      res.status(200).json({
        message: 'Perfil obtenido exitosamente.',
        data: req.user,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener el perfil.' });
    }
  }

  /**
   * Actualizar información del perfil
   */
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Usuario no autenticado.' });
        return;
      }

      const updatedProfile = await UserService.updateProfile(req.user.id, req.body);

      res.status(200).json({
        message: 'Perfil actualizado exitosamente.',
        data: updatedProfile,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al actualizar el perfil.' });
    }
  }

  /**
   * Obtener usuario por ID
   */
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'El ID proporcionado no es válido.' });
        return;
      }

      const user = await UserService.getUserById(id);

      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado.' });
        return;
      }

      res.status(200).json({
        message: 'Usuario encontrado exitosamente.',
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener el usuario.' });
    }
  }
}