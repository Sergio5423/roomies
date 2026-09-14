export class Preferencia {
  private id: number;
  private presupuestoMinimo: number;
  private presupuestoMaximo: number;
  private distancia: number;
  private numeroHabitacionesDeseadas: number;
  private serviciosDeseados: string[];
  private soloConRoomieDisponible: boolean;
  private amoblado: boolean;
  private tipoAlojamiento: string;

  constructor(
    id: number,
    presupuestoMinimo: number,
    presupuestoMaximo: number,
    distancia: number,
    numeroHabitacionesDeseadas: number,
    serviciosDeseados: string[],
    soloConRoomieDisponible: boolean,
    amoblado: boolean,
    tipoAlojamiento: string
  ) {
    this.id = id;
    this.presupuestoMinimo = presupuestoMinimo;
    this.presupuestoMaximo = presupuestoMaximo;
    this.distancia = distancia;
    this.numeroHabitacionesDeseadas = numeroHabitacionesDeseadas;
    this.serviciosDeseados = serviciosDeseados;
    this.soloConRoomieDisponible = soloConRoomieDisponible;
    this.amoblado = amoblado;
    this.tipoAlojamiento = tipoAlojamiento;
  }

  public esTipoCompatible(tipoAvaluado: string): boolean {
    if (this.tipoAlojamiento === "Casa") {
      return tipoAvaluado === "Casa";
    } else if (this.tipoAlojamiento === "Apartamento") {
      return tipoAvaluado === "Apartamento";
    } else if (this.tipoAlojamiento === "Pensionado") {
      return tipoAvaluado === "Pensionado";
    } else {
      return false;
    }
  }
}