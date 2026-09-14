// src/repository/IUsuarioRepository.ts
import { Usuario } from "../model/Usuario/Usuario.js";

// Antipatrón corregido (Fase 1 del plan de refactorización — ver backend/README.md, Problema 1):
// este archivo estaba completamente vacío. "UsuarioService" e "InMemoryUsuarioRepository"
// ya dependían de él ("import type { IUsuarioRepository }" / "implements IUsuarioRepository"),
// por lo que la abstracción existía solo de nombre y el proyecto no compilaba
// (Dependency Inversion Principle roto de facto: no había ninguna abstracción real
// entre el servicio y la persistencia concreta).
//
// Corrección aplicada: se define el contrato con exactamente los métodos que
// "InMemoryUsuarioRepository" ya implementaba, replicando el mismo patrón usado en
// "IAlojamientoRepository". No se agregaron métodos nuevos ni se cambió el comportamiento
// existente — solo se completó la abstracción que faltaba.
export interface IUsuarioRepository {
  guardar(usuario: Usuario): Promise<Usuario>;
  buscarPorId(id: number): Promise<Usuario | null>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
  listarTodos(): Promise<Usuario[]>;
}
