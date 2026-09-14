// src/service/AlojamientoService.ts
import { Alojamiento } from "../model/Alojamiento/Alojamiento";
import type { IAlojamientoRepository } from "../repository/IAlojamientoRepository";
// NOTA (Fase 4): "no encontrado" ahora se expresa con un tipo de error explícito
// (NotFoundError) para que el controlador lo mapee siempre a 404, sin importar desde
// qué método se haya originado (ver Problema 6 del informe de auditoría).
import { NotFoundError } from "../model/errors.js";

export class AlojamientoService {
  constructor(private readonly alojamientoRepo: IAlojamientoRepository) {}

  public async registrarAlojamiento(alojamiento: Alojamiento): Promise<Alojamiento> {
    const existe = await this.alojamientoRepo.buscarPorId(alojamiento.getId());
    if (existe) {
      throw new Error(`El alojamiento con ID ${alojamiento.getId()} ya existe.`);
    }
    return await this.alojamientoRepo.guardar(alojamiento);
  }

  public async obtenerPorId(id: number): Promise<Alojamiento> {
    const alojamiento = await this.alojamientoRepo.buscarPorId(id);
    if (!alojamiento) {
      throw new NotFoundError(`Alojamiento con ID ${id} no fue encontrado.`);
    }
    return alojamiento;
  }

  public async listarTodos(): Promise<Alojamiento[]> {
    return await this.alojamientoRepo.listarTodos();
  }

  public async cambiarEstadoAlojamiento(id: number, nuevoEstado: string): Promise<Alojamiento> {
    const alojamiento = await this.obtenerPorId(id);
    alojamiento.actualizarEstado(nuevoEstado); // Método del dominio
    return await this.alojamientoRepo.guardar(alojamiento);
  }
}