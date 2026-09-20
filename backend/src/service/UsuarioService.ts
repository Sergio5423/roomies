// src/service/UsuarioService.ts
import { Usuario } from "../model/Usuario/Usuario.js";
import { Inquilino } from "../model/Usuario/Inquilino.js";
import { Propietario } from "../model/Usuario/Propietario.js";
import { Alojamiento } from "../model/Alojamiento/Alojamiento.js";
import { Perfil } from "../model/Usuario/Perfil.js";
import type { IUsuarioRepository } from "../repository/IUsuarioRepository.js";
import type { IAlojamientoRepository } from "../repository/IAlojamientoRepository.js";

export class UsuarioService {
  constructor(
    private readonly usuarioRepo: IUsuarioRepository,
    private readonly alojamientoRepo: IAlojamientoRepository
  ) {}

  public async registrarUsuario(usuario: Usuario): Promise<Usuario> {
    const existe = await this.usuarioRepo.buscarPorEmail(usuario.getEmail());
    if (existe) {
      throw new Error(`El email ${usuario.getEmail()} ya se encuentra registrado.`);
    }
    return await this.usuarioRepo.guardar(usuario);
  }

  public async obtenerPorId(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepo.buscarPorId(id);
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado.`);
    }
    return usuario;
  }

  public async agregarAlojamientoAFavoritos(inquilinoId: number, alojamientoId: number): Promise<void> {
    const usuario = await this.obtenerPorId(inquilinoId);
    if (!(usuario instanceof Inquilino)) {
      throw new Error("El usuario especificado no es un Inquilino.");
    }

    const alojamiento = await this.alojamientoRepo.buscarPorId(alojamientoId);
    if (!alojamiento) {
      throw new Error(`Alojamiento con ID ${alojamientoId} no existe.`);
    }

    // Lógica del dominio
    usuario.guardarFavorito(alojamiento);
    await this.usuarioRepo.guardar(usuario);
  }

  public async publicarAlojamientoPropietario(propietarioId: number, alojamiento: Alojamiento): Promise<Alojamiento> {
    const usuario = await this.obtenerPorId(propietarioId);
    if (!(usuario instanceof Propietario)) {
      throw new Error("El usuario especificado no es un Propietario.");
    }

    // Asocia en el dominio y guarda en persistencia
    usuario.publicarAlojamiento(alojamiento);
    await this.alojamientoRepo.guardar(alojamiento);
    await this.usuarioRepo.guardar(usuario);

    return alojamiento;
  }

  public async actualizarPerfilUsuario(usuarioId: number, nuevoPerfil: Perfil): Promise<Usuario> {
    const usuario = await this.obtenerPorId(usuarioId);
    usuario.asociarPerfil(nuevoPerfil);
    return await this.usuarioRepo.guardar(usuario);
  }
}