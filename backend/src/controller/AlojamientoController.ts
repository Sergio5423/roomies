// src/controller/AlojamientoController.ts
import { AlojamientoService } from "../service/AlojamientoService.js";
import { Alojamiento } from "../model/Alojamiento/Alojamiento.js";

export class AlojamientoController {
  constructor(private readonly alojamientoService: AlojamientoService) {}

  public async crear(alojamiento: Alojamiento) {
    try {
      const creado = await this.alojamientoService.registrarAlojamiento(alojamiento);
      return { status: 201, data: creado };
    } catch (error: any) {
      return { status: 400, error: error.message };
    }
  }

  public async obtener(id: number) {
    try {
      const alojamiento = await this.alojamientoService.obtenerPorId(id);
      return { status: 200, data: alojamiento };
    } catch (error: any) {
      return { status: 404, error: error.message };
    }
  }

  public async cambiarEstado(id: number, nuevoEstado: string) {
    try {
      const actualizado = await this.alojamientoService.cambiarEstadoAlojamiento(id, nuevoEstado);
      return { status: 200, data: actualizado };
    } catch (error: any) {
      return { status: 400, error: error.message };
    }
  }
}