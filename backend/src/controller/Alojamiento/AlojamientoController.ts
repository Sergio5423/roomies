import type { Request, Response } from 'express';
import { AlojamientoService } from '../../service/Alojamiento/AlojamientoService';

export class AlojamientoController {
  constructor(private alojamientoService: AlojamientoService) { }

  public publicar = async (req: Request, res: Response): Promise<void> => {
    try {
      // Se recolectan los datos planos enviados desde el front
      const { propietarioId, ...datosAlojamiento } = req.body;

      // El servicio se encarga de crear el objeto
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

  public actualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const alojamientoId = req.params.id;

      // Validamos que exista y que estrictamente sea un string
      if (!alojamientoId || typeof alojamientoId !== 'string') {
        res.status(400).json({ error: "El ID proporcionado no es válido" });
        return; // Corta la ejecución para que TS sepa que de aquí en adelante es seguro
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