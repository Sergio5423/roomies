// src/repository/IUsuarioRepository.ts
import { Usuario } from "../model/Usuario/Usuario.js";

export interface IUsuarioRepository {
  guardar(usuario: Usuario): Promise<Usuario>;
  buscarPorId(id: number): Promise<Usuario | null>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
  listarTodos(): Promise<Usuario[]>;
}