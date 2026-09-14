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
    // NOTA (Fase 8): antes esta relación también se guardaba duplicada dentro de
    // "usuario" (usuario.publicarAlojamiento + usuarioRepo.guardar). Ahora
    // "alojamiento.propietarioId" es la única fuente de verdad, y se valida que
    // coincida con el propietario que está publicando (ver Problema 9 del informe
    // de auditoría).
    if (alojamiento.getPropietarioId() !== propietarioId) {
      throw new Error("El alojamiento no pertenece al propietario especificado.");
    }

    await this.alojamientoRepo.guardar(alojamiento);

    return alojamiento;
  }

  // NOTA (Fase 8): reemplaza a "Propietario.getAlojamientos()" (eliminado de la entidad).
  // Consultar los alojamientos de un propietario es responsabilidad de esta capa de
  // aplicación sobre la única fuente de verdad: el repositorio de alojamientos.
  public async listarAlojamientosDePropietario(propietarioId: number): Promise<Alojamiento[]> {
    const usuario = await buscarUsuarioPorId(this.usuarioRepo, propietarioId);
    if (!(usuario instanceof Propietario)) {
      throw new Error("El usuario especificado no es un Propietario.");
    }
    return this.alojamientoRepo.listarPorPropietarioId(propietarioId);
  }
}
