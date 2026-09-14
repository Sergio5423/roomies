// src/repository/IAlojamientoRepository.ts
import { Alojamiento } from "../model/Alojamiento/Alojamiento.js";

export interface IAlojamientoRepository {
  guardar(alojamiento: Alojamiento): Promise<Alojamiento>;
  buscarPorId(id: number): Promise<Alojamiento | null>;
  listarTodos(): Promise<Alojamiento[]>;
  eliminar(id: number): Promise<boolean>;
  // NOTA (Fase 8): agregado para que este repositorio sea la única fuente de verdad de
  // la relación Propietario<->Alojamiento (ver Problema 9 del informe de auditoría) — antes
  // esa relación también se duplicaba como un arreglo dentro de la entidad Propietario.
  listarPorPropietarioId(propietarioId: number): Promise<Alojamiento[]>;
}