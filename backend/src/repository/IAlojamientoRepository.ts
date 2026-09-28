// src/repository/IAlojamientoRepository.ts
import { Alojamiento } from "../model/Alojamiento/Alojamiento.js";

export interface IAlojamientoRepository {
  guardar(alojamiento: Alojamiento): Promise<Alojamiento>;
  obtenerPorId(id: string): Promise<Alojamiento | null>;
  listarTodos(): Promise<Alojamiento[]>;
  eliminar(id: string): Promise<boolean>;
  actualizar(alojamiento: Alojamiento): Promise<Alojamiento>;
}