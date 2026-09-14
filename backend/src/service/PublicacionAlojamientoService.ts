// src/service/PublicacionAlojamientoService.ts
//
// Extraído de UsuarioService en la Fase 5 del plan de refactorización (ver
// backend/README.md, Problema 4): publicar un alojamiento es un caso de uso exclusivo del
// rol Propietario y no tiene relación con el registro genérico de usuarios ni con la
// gestión de favoritos — antes vivían mezclados en la misma clase.
import { Propietario } from "../model/Usuario/Propietario.js";
import { Alojamiento } from "../model/Alojamiento/Alojamiento.js";
import type { IUsuarioRepository } from "../repository/IUsuarioRepository.js";
import type { IAlojamientoRepository } from "../repository/IAlojamientoRepository.js";
import { buscarUsuarioPorId } from "./buscarUsuarioPorId.js";

export class PublicacionAlojamientoService {
  constructor(
    private readonly usuarioRepo: IUsuarioRepository,
    private readonly alojamientoRepo: IAlojamientoRepository
  ) {}

  public async publicarAlojamientoPropietario(propietarioId: number, alojamiento: Alojamiento): Promise<Alojamiento> {
    const usuario = await buscarUsuarioPorId(this.usuarioRepo, propietarioId);
    if (!(usuario instanceof Propietario)) {
      throw new Error("El usuario especificado no es un Propietario.");
    }

    // Asocia en el dominio y guarda en persistencia
    usuario.publicarAlojamiento(alojamiento);
    await this.alojamientoRepo.guardar(alojamiento);
    await this.usuarioRepo.guardar(usuario);

    return alojamiento;
  }
}
