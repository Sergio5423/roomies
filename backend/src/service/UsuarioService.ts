// src/service/UsuarioService.ts
//
// Antipatrón corregido (Fase 5 del plan de refactorización — ver backend/README.md,
// Problema 4): esta clase concentraba registro genérico de usuarios, gestión de favoritos
// (rol Inquilino), publicación de alojamientos (rol Propietario) y actualización de perfil,
// cuatro responsabilidades sin relación entre sí (violación de SRP). Esos tres últimos casos
// de uso se movieron a FavoritosService, PublicacionAlojamientoService y PerfilService
// respectivamente. Esta clase queda únicamente con lo genérico de "Usuario": registro y
// búsqueda por id — por eso ya no depende de IAlojamientoRepository (esa dependencia era
// solo para favoritos/publicación).
import { Usuario } from "../model/Usuario/Usuario.js";
import type { IUsuarioRepository } from "../repository/IUsuarioRepository.js";
import { buscarUsuarioPorId } from "./buscarUsuarioPorId.js";

export class UsuarioService {
  constructor(private readonly usuarioRepo: IUsuarioRepository) {}

  public async registrarUsuario(usuario: Usuario): Promise<Usuario> {
    const existe = await this.usuarioRepo.buscarPorEmail(usuario.getEmail());
    if (existe) {
      throw new Error(`El email ${usuario.getEmail()} ya se encuentra registrado.`);
    }
    return await this.usuarioRepo.guardar(usuario);
  }

  public async obtenerPorId(id: number): Promise<Usuario> {
    return buscarUsuarioPorId(this.usuarioRepo, id);
  }
}
