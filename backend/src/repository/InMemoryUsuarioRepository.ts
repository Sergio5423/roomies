// src/repository/InMemoryUsuarioRepository.ts
import { Usuario } from "../model/Usuario/Usuario.js";
import type { IUsuarioRepository } from "./IUsuarioRepository.js";

export class InMemoryUsuarioRepository implements IUsuarioRepository {
  private usuarios: Usuario[] = [];

  public async guardar(usuario: Usuario): Promise<Usuario> {
    const index = this.usuarios.findIndex((u) => u.getId() === usuario.getId());
    if (index !== -1) {
      this.usuarios[index] = usuario;
    } else {
      this.usuarios.push(usuario);
    }
    return usuario;
  }

  public async buscarPorId(id: number): Promise<Usuario | null> {
    return this.usuarios.find((u) => u.getId() === id) || null;
  }

  public async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.usuarios.find((u) => u.getEmail().toLowerCase() === email.toLowerCase()) || null;
  }

  public async listarTodos(): Promise<Usuario[]> {
    return [...this.usuarios];
  }
}