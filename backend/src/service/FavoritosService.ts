// src/service/FavoritosService.ts
//
// Extraído de UsuarioService en la Fase 5 del plan de refactorización (ver
// backend/README.md, Problema 4): la gestión de favoritos es un caso de uso exclusivo del
// rol Inquilino y no tiene relación con el registro genérico de usuarios ni con la
// publicación de alojamientos — antes vivían mezclados en la misma clase.
import { Inquilino } from "../model/Usuario/Inquilino.js";
import type { IUsuarioRepository } from "../repository/IUsuarioRepository.js";
import type { IAlojamientoRepository } from "../repository/IAlojamientoRepository.js";
import { buscarUsuarioPorId } from "./buscarUsuarioPorId.js";
import { NotFoundError } from "../model/errors.js";

export class FavoritosService {
  constructor(
    private readonly usuarioRepo: IUsuarioRepository,
    private readonly alojamientoRepo: IAlojamientoRepository
  ) {}

  public async agregarAlojamientoAFavoritos(inquilinoId: number, alojamientoId: number): Promise<void> {
    const usuario = await buscarUsuarioPorId(this.usuarioRepo, inquilinoId);
    if (!(usuario instanceof Inquilino)) {
      throw new Error("El usuario especificado no es un Inquilino.");
    }

    const alojamiento = await this.alojamientoRepo.buscarPorId(alojamientoId);
    if (!alojamiento) {
      throw new NotFoundError(`Alojamiento con ID ${alojamientoId} no existe.`);
    }

    // Lógica del dominio
    usuario.guardarFavorito(alojamiento);
    await this.usuarioRepo.guardar(usuario);
  }
}
