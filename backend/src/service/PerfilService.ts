// src/service/PerfilService.ts
//
// Extraído de UsuarioService en la Fase 5 del plan de refactorización (ver
// backend/README.md, Problema 4): actualizar el perfil es un caso de uso genérico de
// Usuario, pero independiente del registro, los favoritos y la publicación de alojamientos
// — antes vivía mezclado en la misma clase que esos otros tres casos de uso. Al igual que
// antes de esta fase, ningún controlador lo invoca todavía; se preserva tal cual para no
// agregar funcionalidad nueva.
import { Usuario } from "../model/Usuario/Usuario.js";
import { Perfil } from "../model/Usuario/Perfil.js";
import type { IUsuarioRepository } from "../repository/IUsuarioRepository.js";
import { buscarUsuarioPorId } from "./buscarUsuarioPorId.js";

export class PerfilService {
  constructor(private readonly usuarioRepo: IUsuarioRepository) {}

  public async actualizarPerfilUsuario(usuarioId: number, nuevoPerfil: Perfil): Promise<Usuario> {
    const usuario = await buscarUsuarioPorId(this.usuarioRepo, usuarioId);
    usuario.asociarPerfil(nuevoPerfil);
    return await this.usuarioRepo.guardar(usuario);
  }
}
