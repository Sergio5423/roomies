// src/controller/UsuarioController.ts
import { UsuarioService } from "../service/UsuarioService.js";
import { Usuario } from "../model/Usuario/Usuario.js";
import { Alojamiento } from "../model/Alojamiento/Alojamiento.js";

export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  public async registrar(usuario: Usuario) {
    try {
      const nuevoUsuario = await this.usuarioService.registrarUsuario(usuario);
      return { status: 201, data: nuevoUsuario };
    } catch (error: any) {
      return { status: 400, error: error.message };
    }
  }

  public async agregarFavorito(inquilinoId: number, alojamientoId: number) {
    try {
      await this.usuarioService.agregarAlojamientoAFavoritos(inquilinoId, alojamientoId);
      return { status: 200, message: "Alojamiento guardado en favoritos correctamente." };
    } catch (error: any) {
      return { status: 400, error: error.message };
    }
  }

  public async publicarAlojamiento(propietarioId: number, alojamiento: Alojamiento) {
    try {
      const publicado = await this.usuarioService.publicarAlojamientoPropietario(propietarioId, alojamiento);
      return { status: 201, data: publicado };
    } catch (error: any) {
      return { status: 400, error: error.message };
    }
  }
}