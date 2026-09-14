// src/service/buscarUsuarioPorId.ts
//
// Extraído en la Fase 5 del plan de refactorización (ver backend/README.md, Problema 4)
// al dividir "UsuarioService" en varios servicios por caso de uso: todos ellos necesitaban
// la misma lógica de "buscar un Usuario por id o lanzar NotFoundError". Se centraliza aquí
// para no duplicarla en cada servicio nuevo.
import { Usuario } from "../model/Usuario/Usuario.js";
import type { IUsuarioRepository } from "../repository/IUsuarioRepository.js";
import { NotFoundError } from "../model/errors.js";

export async function buscarUsuarioPorId(usuarioRepo: IUsuarioRepository, id: number): Promise<Usuario> {
  const usuario = await usuarioRepo.buscarPorId(id);
  if (!usuario) {
    throw new NotFoundError(`Usuario con ID ${id} no encontrado.`);
  }
  return usuario;
}
