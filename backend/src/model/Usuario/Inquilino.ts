import { Usuario } from './Usuario'
import { Alojamiento } from '../Alojamiento/Alojamiento';
import { Solicitud } from '../Solicitud';
import { PublicacionRoomie } from '../PublicacionRoomie'

export class Inquilino extends Usuario {
  private favoritos: Alojamiento[] = [];
  private solicitudes: Solicitud[] = [];
  private publicacionesRoomie: PublicacionRoomie[] = [];

  constructor(
    id: number,
    nombreCompleto: string,
    telefono: string,
    rol: string,
    estado: string,
    email: string,
    favoritos: Alojamiento[] = [],
    solicitudes: Solicitud[] = [],
    publicacionesRoomie: PublicacionRoomie[] = []
  ) {
    super(id, nombreCompleto, telefono, rol, estado, email);
    this.favoritos = favoritos;
    this.solicitudes = solicitudes;
    this.publicacionesRoomie = publicacionesRoomie;
  }

  public guardarFavorito(alojamiento: Alojamiento): void {
    this.favoritos.push(alojamiento);
  }

  public crearSolicitud(solicitud: Solicitud): void {
    this.solicitudes.push(solicitud);
  }

  public publicarRoomie(publicacion: PublicacionRoomie): void {
    this.publicacionesRoomie.push(publicacion);
  }

  public getFavoritos(): Alojamiento[] { return this.favoritos; }
  public getSolicitudes(): Solicitud[] { return this.solicitudes; }
  public getPublicaciones(): PublicacionRoomie[] { return this.publicacionesRoomie; }
}