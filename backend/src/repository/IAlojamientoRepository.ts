// src/repository/IAlojamientoRepository.ts
import { Alojamiento } from "../model/Alojamiento/Alojamiento.js";

export interface IAlojamientoRepository {
  guardar(alojamiento: Alojamiento): Promise<Alojamiento>;
  buscarPorId(id: number): Promise<Alojamiento | null>;
  listarTodos(): Promise<Alojamiento[]>;
  eliminar(id: number): Promise<boolean>;
}