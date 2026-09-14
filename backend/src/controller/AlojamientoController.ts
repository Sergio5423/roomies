// src/controller/AlojamientoController.ts
// NOTA (Fase 4): el status HTTP de error ya no se fija por convención de cada método
// (ver Problema 6 del informe de auditoría) — se decide centralizadamente según el tipo
// real del error mediante "mapErrorToHttpStatus".
import { AlojamientoService } from "../service/AlojamientoService.js";
import { Alojamiento } from "../model/Alojamiento/Alojamiento.js";
import { mapErrorToHttpStatus } from "./httpErrorMapper.js";
import { EstadoAlojamiento } from "../model/estados.js";

export class AlojamientoController {
  constructor(private readonly alojamientoService: AlojamientoService) {}

  public async crear(alojamiento: Alojamiento) {
    try {
      const creado = await this.alojamientoService.registrarAlojamiento(alojamiento);
      return { status: 201, data: creado };
    } catch (error: any) {
      return { status: mapErrorToHttpStatus(error), error: error.message };
    }
  }

  public async obtener(id: number) {
    try {
      const alojamiento = await this.alojamientoService.obtenerPorId(id);
      return { status: 200, data: alojamiento };
    } catch (error: any) {
      return { status: mapErrorToHttpStatus(error), error: error.message };
    }
  }

  public async cambiarEstado(id: number, nuevoEstado: EstadoAlojamiento) {
    try {
      const actualizado = await this.alojamientoService.cambiarEstadoAlojamiento(id, nuevoEstado);
      return { status: 200, data: actualizado };
    } catch (error: any) {
      return { status: mapErrorToHttpStatus(error), error: error.message };
    }
  }
}