import { Alojamiento } from "../model/Alojamiento/Alojamiento";
import type { IAlojamientoRepository } from "../repository/IAlojamientoRepository";

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
      throw new Error(`Alojamiento con ID ${id} no fue encontrado.`);
    }
    return alojamiento;
  }

  public async listarTodos(): Promise<Alojamiento[]> {
    return await this.alojamientoRepo.listarTodos();
  }

  public async cambiarEstadoAlojamiento(id: number, nuevoEstado: string): Promise<Alojamiento> {
    const alojamiento = await this.obtenerPorId(id);
    alojamiento.actualizarEstado(nuevoEstado);
    return await this.alojamientoRepo.guardar(alojamiento);
  }
}