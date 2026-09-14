// src/repository/InMemoryAlojamientoRepository.ts
import { Alojamiento } from "../model/Alojamiento/Alojamiento";
import type { IAlojamientoRepository } from "./IAlojamientoRepository";

export class InMemoryAlojamientoRepository implements IAlojamientoRepository {
  private alojamientos: Alojamiento[] = [];

  public async guardar(alojamiento: Alojamiento): Promise<Alojamiento> {
    const index = this.alojamientos.findIndex((a) => a.getId() === alojamiento.getId());
    
    if (index !== -1) {
      this.alojamientos[index] = alojamiento
    } else {
      this.alojamientos.push(alojamiento);
    }
    
    return alojamiento;
  }

  public async buscarPorId(id: number): Promise<Alojamiento | null> {
    const encontrado = this.alojamientos.find((a) => a.getId() === id);
    return encontrado || null;
  }

  public async listarTodos(): Promise<Alojamiento[]> {
    return [...this.alojamientos];
  }

  public async eliminar(id: number): Promise<boolean> {
    const index = this.alojamientos.findIndex((a) => a.getId() === id);
    if (index === -1) return false;

    this.alojamientos.splice(index, 1);
    return true;
  }

  public async listarPorPropietarioId(propietarioId: number): Promise<Alojamiento[]> {
    return this.alojamientos.filter((a) => a.getPropietarioId() === propietarioId);
  }
}