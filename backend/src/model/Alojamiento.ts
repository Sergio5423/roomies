export class Alojamiento {
  private id: number;
  private titulo: string;
  private descripcion: string;
  private direccion: string;
  private ciudad: string;
  private barrio: string;
  private tiempoCaminandoUniversidad: string;
  private latitud: number;
  private longitud: number;
  private tipoAlojamiento: string;
  private precioMensual: number;
  private metrosCuadrados: number;
  private numeroCuartos: number;
  private capacidad: number;
  private serviciosIncluidos: string[];
  private amoblado: boolean;
  private banioPrivado: boolean;
  private buscandoRoomie: boolean;
  private imagenes: string[];
  private puntuacionPromedio: number;
  private fechaPublicacion: Date;
  private estado: string;

  constructor(
    id: number,
    titulo: string,
    descripcion: string,
    direccion: string,
    ciudad: string,
    barrio: string,
    tiempoCaminandoUniversidad: string,
    latitud: number,
    longitud: number,
    tipoAlojamiento: string,
    precioMensual: number,
    metrosCuadrados: number,
    numeroCuartos: number,
    capacidad: number,
    serviciosIncluidos: string[],
    amoblado: boolean,
    banioPrivado: boolean,
    buscandoRoomie: boolean,
    imagenes: string[],
    puntuacionPromedio: number = 0,
    fechaPublicacion: Date = new Date(),
    estado: string = 'DISPONIBLE'
  ) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.direccion = direccion;
    this.ciudad = ciudad;
    this.barrio = barrio;
    this.tiempoCaminandoUniversidad = tiempoCaminandoUniversidad;
    this.latitud = latitud;
    this.longitud = longitud;
    this.tipoAlojamiento = tipoAlojamiento;
    this.precioMensual = precioMensual;
    this.metrosCuadrados = metrosCuadrados;
    this.numeroCuartos = numeroCuartos;
    this.capacidad = capacidad;
    this.serviciosIncluidos = serviciosIncluidos;
    this.amoblado = amoblado;
    this.banioPrivado = banioPrivado;
    this.buscandoRoomie = buscandoRoomie;
    this.imagenes = imagenes;
    this.puntuacionPromedio = puntuacionPromedio;
    this.fechaPublicacion = fechaPublicacion;
    this.estado = estado;
  }

  // Getters útiles para la gestión en memoria
  public getId(): number {
    return this.id;
  }

  public getEstado(): string {
    return this.estado;
  }

  // Métodos del UML implementados
  public estaDisponible(): boolean {
    return this.estado.toUpperCase() === 'DISPONIBLE';
  }

  public reservar(): void {
    if (!this.estaDisponible()) {
      throw new Error(`El alojamiento no se encuentra disponible. Estado actual: ${this.estado}`);
    }
    this.estado = 'RESERVADO';
  }
}