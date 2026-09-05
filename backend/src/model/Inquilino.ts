import { Alojamiento } from './Alojamiento';
import { Solicitud } from './Solicitud';

export class Inquilino {
  private favoritos: Alojamiento[] = [];
  private solicitudes: Solicitud[] = [];
  private publicacionesRoomie: any[] = [];

  constructor(
    private id: number,
    private nombre: string,
    private email: string
  ) {}

  // Getters para consultar el estado interno
  public getFavoritos(): Alojamiento[] {
    return this.favoritos;
  }

  public getSolicitudes(): Solicitud[] {
    return this.solicitudes;
  }

  // Búsqueda de alojamientos filtrando un arreglo en memoria
  public buscarAlojamiento(alojamientos: Alojamiento[], filtroCiudad?: string): Alojamiento[] {
    return alojamientos.filter((alojamiento) => {
      const estaDisponible = alojamiento.estaDisponible();
      if (!filtroCiudad) return estaDisponible;
      return estaDisponible; // Aquí se agregaría la condición de ciudad usando getters de Alojamiento
    });
  }

  // Agrega un alojamiento a la lista de favoritos si no existe previamente
  public guardarFavorito(alojamiento: Alojamiento): void {
    const existe = this.favoritos.some((fav) => fav.getId() === alojamiento.getId());
    if (existe) {
      throw new Error('El alojamiento ya se encuentra en tus favoritos.');
    }
    this.favoritos.push(alojamiento);
  }

  // Crea una solicitud para un alojamiento y la almacena en el estado local
  public crearSolicitud(
    idSolicitud: number,
    fechaInicio: Date,
    fechaFin: Date,
    mensaje: string
  ): Solicitud {
    const nuevaSolicitud = new Solicitud(
      idSolicitud,
      new Date(),
      fechaInicio,
      fechaFin,
      mensaje,
      'PENDIENTE'
    );
    this.solicitudes.push(nuevaSolicitud);
    return nuevaSolicitud;
  }

  // Cancela una solicitud existente buscando por su ID
  public cancelarSolicitud(idSolicitud: number): void {
    const solicitud = this.solicitudes.find((sol) => sol.getId() === idSolicitud);
    if (!solicitud) {
      throw new Error(`No se encontró la solicitud con el ID: ${idSolicitud}`);
    }
    solicitud.cancelarSolicitud();
  }

  // Registra una nueva publicación para buscar roomie
  public publicarBusquedaRoomie(publicacion: any): void {
    this.publicacionesRoomie.push(publicacion);
  }

  // Retorna todas las publicaciones de roomie almacenadas
  public buscarRoomie(): any[] {
    return this.publicacionesRoomie;
  }
}