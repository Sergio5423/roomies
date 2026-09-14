// src/controller/UsuarioController.ts
// NOTA (Fase 4): el status HTTP de error ya no se fija por convención de cada método
// (ver Problema 6 del informe de auditoría) — se decide centralizadamente según el tipo
// real del error mediante "mapErrorToHttpStatus".
// NOTA (Fase 5): este controlador ya no depende de un único "UsuarioService" con todos los
// casos de uso mezclados (ver Problema 4 del informe de auditoría) — cada método delega en
// el servicio específico de su caso de uso (registro, favoritos, publicación).
import { UsuarioService } from "../service/UsuarioService.js";
import { FavoritosService } from "../service/FavoritosService.js";
import { PublicacionAlojamientoService } from "../service/PublicacionAlojamientoService.js";
import { Usuario } from "../model/Usuario/Usuario.js";
import { Alojamiento } from "../model/Alojamiento/Alojamiento.js";
import { mapErrorToHttpStatus } from "./httpErrorMapper.js";

export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly favoritosService: FavoritosService,
    private readonly publicacionAlojamientoService: PublicacionAlojamientoService
  ) {}

  public async registrar(usuario: Usuario) {
    try {
      const nuevoUsuario = await this.usuarioService.registrarUsuario(usuario);
      return { status: 201, data: nuevoUsuario };
    } catch (error: any) {
      return { status: mapErrorToHttpStatus(error), error: error.message };
    }
  }

  public async agregarFavorito(inquilinoId: number, alojamientoId: number) {
    try {
      await this.favoritosService.agregarAlojamientoAFavoritos(inquilinoId, alojamientoId);
      return { status: 200, message: "Alojamiento guardado en favoritos correctamente." };
    } catch (error: any) {
      return { status: mapErrorToHttpStatus(error), error: error.message };
    }
  }

  public async publicarAlojamiento(propietarioId: number, alojamiento: Alojamiento) {
    try {
      const publicado = await this.publicacionAlojamientoService.publicarAlojamientoPropietario(propietarioId, alojamiento);
      return { status: 201, data: publicado };
    } catch (error: any) {
      return { status: mapErrorToHttpStatus(error), error: error.message };
    }
  }
}