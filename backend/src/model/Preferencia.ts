export class Preferencia {
  private id: number;
  private presupuestoMinimo: number;
  private presupuestoMaximo: number;
  private distanciaMaxMinutos: number;
  private numeroHabitacionesDeseadas: number;
  private serviciosDeseados: string[];
  private soloConRoomieDisponible: boolean;
  private tipoAlojamiento: string; // Reemplazado TipoAlojamiento por string
  private amoblado: boolean;

  constructor(
    id: number,
    presupuestoMinimo: number,
    presupuestoMaximo: number,
    distanciaMaxMinutos: number,
    numeroHabitacionesDeseadas: number,
    serviciosDeseados: string[],
    soloConRoomieDisponible: boolean,
    tipoAlojamiento: string,
    amoblado: boolean
  ) {
    this.id = id;
    this.presupuestoMinimo = presupuestoMinimo;
    this.presupuestoMaximo = presupuestoMaximo;
    this.distanciaMaxMinutos = distanciaMaxMinutos;
    this.numeroHabitacionesDeseadas = numeroHabitacionesDeseadas;
    this.serviciosDeseados = serviciosDeseados;
    this.soloConRoomieDisponible = soloConRoomieDisponible;
    this.tipoAlojamiento = tipoAlojamiento;
    this.amoblado = amoblado;
  }

  public filtrarPorPrecio(): void {
    // Lógica para filtrar por precio
  }

  public filtrarPorDistancia(): void {
    // Lógica para filtrar por distancia
  }

  public filtrarPorHabitaciones(): void {
    // Lógica para filtrar por habitaciones
  }

  public filtrarPorServicios(): void {
    // Lógica para filtrar por servicios
  }

  public filtrarPorRoomie(): void {
    // Lógica para filtrar por roomie
  }
}