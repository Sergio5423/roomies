import type { Request, Response } from 'express';
import { AlojamientoService } from '../../services/Alojamiento/alojamiento.service';

export class AlojamientoController {
  constructor(private alojamientoService: AlojamientoService) { }

  public publicar = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Usuario no autenticado" });
        return;
      }

      const propietarioId = req.user.id;
      const datosAlojamiento = req.body;

      const nuevoAlojamiento = await this.alojamientoService.publicarAlojamiento(
        propietarioId,
        datosAlojamiento
      );

      res.status(201).json({
        mensaje: "Alojamiento publicado con éxito",
        data: nuevoAlojamiento
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public listarTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const alojamientos = await this.alojamientoService.listarTodos();
      
      res.status(200).json({
        mensaje: "Alojamientos obtenidos con éxito",
        data: alojamientos
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public obtenerPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const alojamientoId = req.params.id;

      if (!alojamientoId || typeof alojamientoId !== 'string') {
        res.status(400).json({ error: "El ID proporcionado no es válido" });
        return;
      }

      const alojamiento = await this.alojamientoService.obtenerPorId(alojamientoId);

      if (!alojamiento) {
        res.status(404).json({ error: "Alojamiento no encontrado" });
        return;
      }

      res.status(200).json({
        mensaje: "Alojamiento encontrado",
        data: alojamiento
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public actualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const alojamientoId = req.params.id;

      if (!alojamientoId || typeof alojamientoId !== 'string') {
        res.status(400).json({ error: "El ID proporcionado no es válido" });
        return;
      }

      const datosActualizados = req.body;

      const alojamiento = await this.alojamientoService.actualizarAlojamiento(
        alojamientoId,
        datosActualizados
      );

      res.status(200).json({
        mensaje: "Alojamiento actualizado",
        data: alojamiento
      });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  public cambiarEstado = async (req: Request, res: Response): Promise<void> => {
    try {
      const alojamientoId = req.params.id;
      const { nuevoEstado } = req.body;

      if (!alojamientoId || typeof alojamientoId !== 'string') {
        res.status(400).json({ error: "El ID proporcionado no es válido" });
        return;
      }

      const alojamiento = await this.alojamientoService.cambiarEstado(
        alojamientoId,
        nuevoEstado
      );

      res.status(200).json({
        mensaje: `Estado del alojamiento cambiado a ${nuevoEstado}`,
        data: alojamiento
      });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}